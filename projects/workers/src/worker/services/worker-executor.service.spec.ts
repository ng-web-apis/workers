import {TestBed} from '@angular/core/testing';
import {WorkerModule} from '@ng-web-apis/workers';
import {take} from 'rxjs/operators';
import {WorkerExecutor} from './worker-executor.service';

describe('WorkerExecutorService', () => {
    let service: WorkerExecutor;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [WorkerModule],
        });

        service = TestBed.get(WorkerExecutor);
    });

    it('should run worker and return correct data', async () => {
        const workerPromise: Promise<string> = service.execute<string, string>(
            data => Promise.resolve().then(() => data),
            'some data',
        );

        expect(await workerPromise).toEqual('some data');
    }, 10000);

    it('should create worker', async () => {
        const thread = service.createWorker<string, string>(data =>
            Promise.resolve(data),
        );

        const workerPromise = thread.pipe(take(1)).toPromise();

        thread.postMessage('some data');

        expect(await workerPromise).toEqual('some data');
    }, 10000);
});
