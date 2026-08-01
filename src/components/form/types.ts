import { JSX } from "solid-js";
import { MsgState } from "../msg/types.js";
export type { FormState } from "./state.js";

export interface Props {
    id?: string;
    mapCodeToMsg: (key: number) => string;
    children: JSX.Element;
    onSubmit: (body: { [key: string]: any }) => Promise<number | undefined>;
    tagless?: true;
}

export const enum Status {
    Idle = "idle",
    Submitting = "sub",
    Success = "scs",
    Error = "err",
}

export interface Field {
    // it is a function instaed of a property so if the the key changes
    // function will just get the latest value
    getKey: () => string;
    getValue(): any;
    validate(): boolean;
    elem: HTMLElement;
    msgState: MsgState;
    errCodes: Array<number>;
}
