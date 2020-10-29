import {ChangeDetectionStrategy, Component} from '@angular/core';
import {WebWorker, WorkerExecutor} from '@ng-web-apis/workers';

@Component({
    selector: 'main',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    workerThread: WebWorker<string, string>;

    constructor(webWorkerExecutor: WorkerExecutor) {
        this.workerThread = webWorkerExecutor.createWorker((result: string) =>
            Promise.resolve(`Message from worker: ${result}`),
        );
    }

    oneMoreFn(data: string): Promise<string> {
        return Promise.resolve(data);
    }
}
