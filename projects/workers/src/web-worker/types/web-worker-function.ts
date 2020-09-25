export type WebWorkerFunction<T = any, R = any> = (data: T) => R | PromiseLike<R>;
