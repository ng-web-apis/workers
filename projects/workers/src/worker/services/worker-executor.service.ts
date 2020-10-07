import {Injectable} from '@angular/core';
import {WebWorker} from '../classes/web-worker';
import {WorkerFunction} from '../types/worker-function';

@Injectable()
export class WorkerExecutor {
    execute<T, R>(fn: WorkerFunction<T, R>, data?: T): Promise<R> {
        const worker = this.createWorker(fn);
        const promise = worker.toPromise();

        worker.next(data);
        worker.complete();

        return promise;
    }

    createWorker<T, R>(
        fn: WorkerFunction<T, R>,
        options?: WorkerOptions,
    ): WebWorker<T, R> {
        return WebWorker.fromFunction<T, R>(fn, options);
    }
}
