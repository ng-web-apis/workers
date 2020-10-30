import {fromEvent} from 'rxjs';
import {takeWhile} from 'rxjs/operators';
import {WorkerFunction} from '../types/worker-function';
import {AnyNextSubject} from './any-next-subject';

export class WebWorker<T = any, R = any> extends AnyNextSubject<R> {
    private worker!: Worker;

    constructor(private url: string, options?: WorkerOptions) {
        super();

        try {
            this.worker = new Worker(url, options);
        } catch (e) {
            this.error(e);
        }

        fromEvent<MessageEvent>(this.worker, 'message')
            .pipe(takeWhile(() => !this.isStopped))
            .subscribe(event => {
                if (event.data) {
                    if (event.data.hasOwnProperty('error')) {
                        this.error(event.data.error);
                    } else if (event.data.hasOwnProperty('result')) {
                        super.next(event.data.result);
                    }
                }
            });

        fromEvent<ErrorEvent>(this.worker, 'error')
            .pipe(takeWhile(() => !this.isStopped))
            .subscribe(event => {
                this.error(event.error);
            });
    }

    public static fromFunction<T, R>(
        fn: WorkerFunction<T, R>,
        options?: WorkerOptions,
    ): WebWorker<T, R> {
        return new WebWorker<T, R>(WebWorker.createFnUrl(fn), options);
    }

    private static createFnUrl(fn: WorkerFunction): string {
        const script = `
(function(fn){
    function isFunction(type){
        return type === 'function';
    }

    self.addEventListener('message', function(e) {
        var result = fn.call(null, e.data);
        if(result && [typeof result.then, typeof result.catch].every(isFunction)){
            result.then(function(res){
                postMessage({result: res});
            }).catch(function(error){
                postMessage({error: error});
            })
        } else {
            postMessage({result: result});
        }
    })
})(${fn.toString()});
        `;

        const blob = new Blob([script], {type: 'text/javascript'});

        return URL.createObjectURL(blob);
    }

    complete() {
        this.worker.terminate();
        URL.revokeObjectURL(this.url);
        super.complete();
    }

    next(value?: T) {
        this.worker.postMessage(value);
    }
}
