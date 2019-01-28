interface IInterceptor {
    request?: (request?: any) => any;
    requestError?: (err?: any) => any;
    response?: (response?: any, request?: any) => any;
    responseError?: (err?: any) => any;
}
interface IInterceptors {
    interceptors: IInterceptor[];
    API: object;
}
declare class Interceptors implements IInterceptors {
    interceptors: any;
    API: any;
    constructor(API: object, interceptableMethods?: any[]);
    register(interceptor: any): () => void;
    unregister(interceptor: any): void;
    clear(): void;
    private interceptedMethod;
}
export default Interceptors;
