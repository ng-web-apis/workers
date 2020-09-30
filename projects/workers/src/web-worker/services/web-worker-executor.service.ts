import {inject, Injectable, InjectFlags} from '@angular/core';
import {WebWorker} from '../classes/web-worker';
import {WebWorkerFunction} from '../types/web-worker-function';
import {WebWorkerModule} from '../web-worker.module';

@Injectable({
    providedIn: WebWorkerModule,
    useFactory(): WebWorkerExecutor {
        const instance = inject(WebWorkerExecutor, InjectFlags.Optional);

        return instance || new WebWorkerExecutor();
    },
})
export class WebWorkerExecutor {
    execute<T, R>(fn: WebWorkerFunction<T, R>, data: T): Promise<R> {
        const worker = this.createWorker(fn);
        const promise = worker.toPromise();

        worker.next(data);

        return promise;
    }

    createWorker<T, R>(
        fn: WebWorkerFunction<T, R>,
        options?: WorkerOptions,
    ): WebWorker<T, R> {
        return WebWorker.fromFunction<T, R>(fn, options);
    }
}
