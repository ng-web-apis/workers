import {ChangeDetectionStrategy, Component} from '@angular/core';
import {toData, WebWorker} from '@ng-web-apis/workers';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
    selector: 'main',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    readonly workerThread = WebWorker.fromFunction<void, number>(this.startCompute);
    readonly workerData$ = this.workerThread.pipe(toData());
    readonly emitter = new Subject<void>();
    readonly result$ = this.emitter.pipe(map(this.startCompute));

    startCompute(): number {
        const start = performance.now();

        Array.from({length: 16000}).forEach((_, index) =>
            Array.from({length: index}).reduce<number>((sum: number) => sum + 1, 0),
        );

        return performance.now() - start;
    }
}
