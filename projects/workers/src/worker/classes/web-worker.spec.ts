import {WebWorker} from './web-worker';

describe('WebWorker', () => {
    it('should create worker from a function', () => {
        const worker = WebWorker.fromFunction(d => d);

        expect(worker instanceof WebWorker).toEqual(true);
        expect((worker as any).worker instanceof Worker).toEqual(true);
    });

    it("shouldn't create worker", async () => {
        const worker = new WebWorker('some/wrong/url');

        await expectAsync(worker.toPromise()).toBeRejected();
    });
});
