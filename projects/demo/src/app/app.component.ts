import {ChangeDetectionStrategy, Component} from '@angular/core';
import {WebWorker, WebWorkerExecutor} from '@ng-web-apis/workers';

@Component({
    selector: 'main',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    public workerThread: WebWorker<string, string>;

    constructor(webWorkerExecutor: WebWorkerExecutor) {
        this.workerThread = webWorkerExecutor.createWorker((result: string) =>
            Promise.resolve(`Message from worker: ${result}`),
        );
    }
}
