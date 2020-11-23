import {Pipe, PipeTransform} from '@angular/core';
import {Observable} from 'rxjs';
import {WebWorker} from '../classes/web-worker';
import {toData} from '../operators/to-data';
import {WorkerFunction} from '../types/worker-function';

@Pipe({
    name: 'waWorker',
})
export class WorkerPipe implements PipeTransform {
    private workers = new WeakMap<WorkerFunction, WebWorker>();
    private observers = new WeakMap<WebWorker, Observable<any>>();

    transform<T, R>(value: T, fn: WorkerFunction<T, R>): Observable<R> {
        const worker: WebWorker<T, R> =
            this.workers.get(fn) || WebWorker.fromFunction(fn);

        this.workers.set(fn, worker);
        worker.postMessage(value);

        const observer = this.observers.get(worker) || worker.pipe(toData());

        this.observers.set(worker, observer);

        return observer;
    }
}
