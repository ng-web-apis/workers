import {EMPTY, fromEvent, merge, Observable, Observer} from 'rxjs';
import {take, tap} from 'rxjs/operators';
import {WORKER_BLANK_FN} from '../consts/worker-fn-template';
import {TypedMessageEvent} from '../types/typed-message-event';
import {WorkerFunction} from '../types/worker-function';

export class WebWorker<T = any, R = any> extends Observable<TypedMessageEvent<R>> {
    private readonly worker: Worker | undefined;
    private readonly url: string;
    private isStopped: boolean;
    private observers: Observer<TypedMessageEvent<R>>[];

    constructor(url: string, options?: WorkerOptions) {
        let worker: Worker | undefined;
        let error: any;

        try {
            worker = new Worker(url, options);
        } catch (e) {
            error = e;
        }

        super(subscriber => {
            let eventStream$: Observable<TypedMessageEvent<R> | ErrorEvent> = EMPTY;

            if (error) {
                subscriber.error(error);
            } else if (this.isStopped) {
                subscriber.complete();
            } else if (worker) {
                eventStream$ = merge(
                    fromEvent<TypedMessageEvent<R>>(worker, 'message').pipe(
                        tap(event => subscriber.next(event)),
                    ),
                    fromEvent<ErrorEvent>(worker, 'error').pipe(
                        tap(event => subscriber.error(event)),
                    ),
                );

                this.observers.push(subscriber);
            }

            return eventStream$.subscribe();
        });

        this.worker = worker;
        this.url = url;

        this.isStopped = false;
        this.observers = [];
    }

    static fromFunction<T, R>(
        fn: WorkerFunction<T, R>,
        options?: WorkerOptions,
    ): WebWorker<T, R> {
        return new WebWorker<T, R>(WebWorker.createFnUrl(fn), options);
    }

    static execute<T, R>(
        fn: WorkerFunction<T, R>,
        data: T,
    ): Promise<TypedMessageEvent<R>> {
        const worker = WebWorker.fromFunction(fn);
        const promise = worker.pipe(take(1)).toPromise();

        worker.postMessage(data);

        return promise.then(result => {
            worker.terminate();

            return result;
        });
    }

    private static createFnUrl(fn: WorkerFunction): string {
        const script = `(${WORKER_BLANK_FN})(${fn});`;

        const blob = new Blob([script], {type: 'text/javascript'});

        return URL.createObjectURL(blob);
    }

    terminate() {
        if (this.isStopped) {
            return;
        }

        if (this.worker) {
            this.worker.terminate();
        }

        URL.revokeObjectURL(this.url);

        this.isStopped = true;
        this.observers.forEach(observer => {
            if (!observer.closed) {
                observer.complete();
            }
        });
        this.observers = [];
    }

    postMessage(value: T) {
        if (this.worker) {
            this.worker.postMessage(value);
        }
    }
}
