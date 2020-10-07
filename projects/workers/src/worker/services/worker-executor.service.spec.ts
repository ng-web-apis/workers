import {TestBed} from '@angular/core/testing';

import {WorkerExecutor} from './worker-executor.service';

describe('WebWorkerExecutorService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: WorkerExecutor = TestBed.get(WorkerExecutor);

        expect(service).toBeTruthy();
    });
});
