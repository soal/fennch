import { IFenchRequest } from "./fRequest";
export interface IFenchResponse {
    body?: object | string | Blob;
    path: string;
    err?: Error;
    headers: object;
    ok: boolean;
    raw: Response;
    request: IFenchRequest;
    status: number;
    statusText: string;
    type: string;
    url: string;
}
export default function createResponse(rawResponse: Response, fRequest: IFenchRequest): Promise<IFenchResponse>;
