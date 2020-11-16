import {Injectable} from '@angular/core';
import {take} from 'rxjs/operators';
import {WebWorker} from '../classes/web-worker';
import {WorkerFunction} from '../types/worker-function';

@Injectable()
export class WorkerExecutor {
    execute<T, R>(fn: WorkerFunction<T, R>, data: T): Promise<R> {
        const worker = this.createWorker(fn);
        const promise = worker.pipe(take(1)).toPromise();

        worker.postMessage(data);

        return promise;
    }

    createWorker<T, R>(
        fn: WorkerFunction<T, R>,
        options?: WorkerOptions,
    ): WebWorker<T, R> {
        return WebWorker.fromFunction<T, R>(fn, options);
    }
}
