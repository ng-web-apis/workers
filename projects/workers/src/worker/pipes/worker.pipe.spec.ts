import {WorkerExecutor} from '../services/worker-executor.service';
import {WorkerPipe} from './worker.pipe';

describe('WorkerPipe', () => {
    it('create an instance', () => {
        const pipe = new WorkerPipe(new WorkerExecutor());

        expect(pipe).toBeTruthy();
    });
});
