import {Observable} from 'rxjs';
import {WebWorker} from './web-worker';

describe('WebWorker', () => {
    it('should fail if a worker is not available', async () => {
        const OriginalWorker = Worker;

        delete (window as any).Worker;

        const worker = WebWorker.fromFunction(d => d);

        await expectAsync(worker.toPromise()).toBeRejected();

        (window as any).Worker = OriginalWorker;
    });

    it('should create worker from a function', () => {
        const worker = WebWorker.fromFunction(d => d);

        expect(worker instanceof WebWorker).toEqual(true);
        expect((worker as any).worker instanceof Worker).toEqual(true);
    });

    it('should trigger an error if URL not found', async () => {
        const worker = new WebWorker('some/wrong/url');

        await expectAsync(worker.toPromise()).toBeRejected();
    });

    it('should fail if an inner promise is rejected', async () => {
        const worker = WebWorker.fromFunction(() => Promise.reject('reason'));

        worker.next();

        await expect(await worker.toPromise().catch(err => err)).toEqual('reason');
    });

    it('should resolve the last value before completing', async () => {
        const worker = WebWorker.fromFunction((data: string) => Promise.resolve(data));

        const promise = worker
            .pipe(source => {
                return new Observable(subscriber => {
                    source.subscribe({
                        next(value: string) {
                            (source as WebWorker).complete();
                            subscriber.next(value);
                            subscriber.complete();
                        },
                    });
                });
            })
            .toPromise();

        worker.next('a');
        worker.next('b');
        expect(await promise).toEqual('a');
    });
});
