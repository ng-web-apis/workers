import {Pipe, PipeTransform} from '@angular/core';
import {Observable} from 'rxjs';
import {WebWorker} from '../classes/web-worker';
import {WorkerFunction} from '../types/worker-function';

@Pipe({
    name: 'waWorker',
})
export class WorkerPipe implements PipeTransform {
    private workers = new WeakMap<WorkerFunction, WebWorker>();

    transform<T, R>(value: T, fn: WorkerFunction<T, R>): Observable<R> {
        const worker = this.workers.get(fn) || WebWorker.fromFunction(fn);

        this.workers.set(fn, worker);

        worker.postMessage(value);

        return worker;
    }
}
