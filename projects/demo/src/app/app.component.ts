import {ChangeDetectionStrategy, Component} from '@angular/core';
import {WebWorker, WorkerExecutor} from '@ng-web-apis/workers';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
    selector: 'main',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    readonly workerThread: WebWorker<void, number>;
    readonly emitter: Subject<void>;
    readonly result$: Observable<number>;

    constructor(webWorkerExecutor: WorkerExecutor) {
        this.workerThread = webWorkerExecutor.createWorker(this.startCompute);
        this.emitter = new Subject();
        this.result$ = this.emitter.pipe(map(this.startCompute));
    }

    startCompute(): number {
        function compute(num: number): number {
            return Array.from({length: num}).reduce<number>((sum: number) => sum + 1, 0);
        }

        const start = performance.now();

        Array.from({length: 16000}).forEach((_, index) => compute(index));

        return performance.now() - start;
    }
}
