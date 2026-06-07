import { JSX } from "solid-js";
import { MsgState } from "../msg/types.js";
export type { FormState } from "./state.js";

export interface Props {
    mapCodeToMsg: (key: number) => string;
    children: JSX.Element;
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
    getKey: () => string | undefined;
    getValue(): any;
    validate(): boolean;
    elem: HTMLElement;
    msgState: MsgState;
}
