declare type FenchOptions = RequestInit & {
    parseErr?: Error;
    headers?: {
        Authorization: string;
    } & object;
    baseURI?: string;
    raw?: boolean;
    arrayFormat?: string;
    auth?: object;
    timeout?: number;
    body?: object;
    signal?: object;
};
declare class Fench {
    interceptor: object;
    timeout: number;
    parseErr?: Error;
    req: any;
    private opts;
    private headers;
    private raw;
    private arrayFormat;
    private fetch;
    constructor(opts?: FenchOptions, fetchImpl?: any);
    jwt(token: any): this;
    private makeRequest;
    private prepareRequest;
    private setup;
}
export default Fench;
