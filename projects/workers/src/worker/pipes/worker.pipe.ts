import {Pipe, PipeTransform} from '@angular/core';
import {Observable} from 'rxjs';
import {WebWorker} from '../classes/web-worker';
import {WorkerExecutor} from '../services/worker-executor.service';
import {WorkerFunction} from '../types/worker-function';

@Pipe({
    name: 'waWorker',
})
export class WorkerPipe implements PipeTransform {
    private workers = new WeakMap<WorkerFunction, WebWorker>();

    constructor(private workerExecutor: WorkerExecutor) {}

    transform<T, R>(value: T, fn: WorkerFunction<T, R>): Observable<R> {
        const worker = this.workers.has(fn)
            ? (this.workers.get(fn) as WebWorker)
            : this.workerExecutor.createWorker(fn);

        this.workers.set(fn, worker);

        worker.next(value);

        return worker;
    }
}
