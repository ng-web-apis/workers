import {TestBed} from '@angular/core/testing';

import {WebWorkerExecutor} from './web-worker-executor.service';

describe('WebWorkerExecutorService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: WebWorkerExecutor = TestBed.get(WebWorkerExecutor);

        expect(service).toBeTruthy();
    });
});
