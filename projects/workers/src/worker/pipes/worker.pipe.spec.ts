import {take} from 'rxjs/operators';
import {WorkerExecutor} from '../services/worker-executor.service';
import {WorkerPipe} from './worker.pipe';

describe('WorkerPipe', () => {
    let pipe: WorkerPipe;

    beforeEach(() => {
        pipe = new WorkerPipe(new WorkerExecutor());
    });

    it('should emit the first value', async () => {
        const result = await pipe
            .transform('a', data => data)
            .pipe(take(1))
            .toPromise();

        expect(result).toEqual('a');
    });

    it('should return the same worker for the same function', async () => {
        const workerFn = (data: unknown) => data;

        const worker = await pipe.transform('a', workerFn);
        const theSameWorker = await pipe.transform('a', workerFn);

        expect(worker).toEqual(theSameWorker);
    });

    it('should return a different worker for a different function', async () => {
        const worker = await pipe.transform('a', (data: unknown) => data);
        const differentWorker = await pipe.transform('a', (data: unknown) => data);

        expect(worker).not.toEqual(differentWorker);
    });
});
