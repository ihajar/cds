import ky, { type Options } from "ky";
import { string } from "zod";

export const api = {
    get: <TResponse>(url: string, opts?: Options) =>
        ky.get(url, opts).json<TResponse>(),
    post: <TRsponse>(url: string, opts?: Options) =>
        ky.post(url, opts).json<TRsponse>(),
}