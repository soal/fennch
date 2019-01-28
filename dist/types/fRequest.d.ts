export interface IFenchRequest {
    body?: object;
    endpoint: string;
    headers: object;
    method?: string;
    mode: string;
    raw?: Request;
    params?: object;
    signal: AbortSignal;
    url: string;
}
interface IOptions {
    params?: object;
    body?: object;
    headers?: object;
    method?: string;
    mode?: string;
}
export default function createRequest(args: {
    baseURI: string;
    globalHeaders: object;
    path: string;
    options: IOptions;
    arrayFormat: string;
    abortSignal: AbortSignal;
}): IFenchRequest;
export {};
