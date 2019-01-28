declare type PromiseExecutor = (resolve?: (value?: any) => void, reject?: (value?: any) => void, abortSignal?: AbortSignal) => any;
declare class AbortablePromise implements AbortController {
    static resolve(aborter: any, data: any): AbortablePromise;
    static reject(aborter: any, err: any): AbortablePromise;
    static race(aborter: any, data: any): AbortablePromise;
    static all(aborter: any, data: any): AbortablePromise;
    signal: AbortSignal;
    abortController: AbortController;
    private promise;
    constructor(executor: Promise<any> | PromiseExecutor, aborter?: AbortController | null);
    then(...args: any[]): AbortablePromise;
    catch(...args: any[]): AbortablePromise;
    finally(...args: any[]): Promise<any>;
    abort(): void;
}
export default AbortablePromise;
