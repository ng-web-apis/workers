import {ChangeDetectionStrategy, Component} from '@angular/core';
import {WebWorker, WorkerExecutor} from '@ng-web-apis/workers';

@Component({
    selector: 'main',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    public workerThread: WebWorker<string, string>;

    constructor(webWorkerExecutor: WorkerExecutor) {
        this.workerThread = webWorkerExecutor.createWorker((result: string) =>
            Promise.resolve(`Message from worker: ${result}`),
        );
    }

    oneMoreFn(data: any): Promise<any> {
        return Promise.resolve().then(() => data);
    }
}
