import {fromEvent, Observable} from 'rxjs';
import {take, takeWhile} from 'rxjs/operators';
import {WORKER_BLANK_FN} from '../consts/worker-fn-template';
import {TypedMessageEvent} from '../types/typed-message-event';
import {WorkerFunction} from '../types/worker-function';

export class WebWorker<T = any, R = any> extends Observable<TypedMessageEvent<R>> {
    private worker: Worker;
    private url: string;

    constructor(url: string, options?: WorkerOptions) {
        let worker!: Worker;
        let error: any;

        try {
            worker = new Worker(url, options);
        } catch (e) {
            error = e;
        }

        super(subscriber => {
            if (error) {
                subscriber.error(error);
            }

            fromEvent<TypedMessageEvent<R>>(this.worker, 'message')
                .pipe(takeWhile(() => !subscriber.closed))
                .subscribe(event => {
                    subscriber.next(event);
                });

            fromEvent<ErrorEvent>(this.worker, 'error')
                .pipe(takeWhile(() => !subscriber.closed))
                .subscribe(event => {
                    subscriber.error(event);
                });
        });

        this.worker = worker;
        this.url = url;
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

        return promise;
    }

    private static createFnUrl(fn: WorkerFunction): string {
        const script = `(${WORKER_BLANK_FN})(${fn});`;

        const blob = new Blob([script], {type: 'text/javascript'});

        return URL.createObjectURL(blob);
    }

    terminate() {
        this.worker.terminate();
        URL.revokeObjectURL(this.url);
    }

    postMessage(value: T) {
        this.worker.postMessage(value);
    }
}
