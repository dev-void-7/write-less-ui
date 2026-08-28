import { Accessor, createSignal, Setter } from "solid-js";
import { mapCodeToMsg } from "../../states/map-code-to-msg.js";

export interface Props {
    layout?: "box" | "none";
    state?: MsgState;
    float?: boolean;
}

export class MsgState {
    status: Accessor<Status>;
    setStatus: Setter<Status>;
    code: Accessor<number | undefined>;
    setCode: Setter<number | undefined>;

    constructor() {
        [this.status, this.setStatus] = createSignal(Status.None as Status);
        [this.code, this.setCode] = createSignal();
    }

    get msg(): string | undefined {
        const code = this.code();
        if (code) {
            return mapCodeToMsg(code);
        }
    }

    clear() {
        this.setCode(undefined);
        this.setStatus(Status.None);
    }

    info(code: number) {
        this.setCode(code);
        this.setStatus(Status.Info);
    }

    warn(code: number) {
        this.setCode(code);
        this.setStatus(Status.Warning);
    }

    err(code: number) {
        this.setCode(code);
        this.setStatus(Status.Error);
    }

    scs(code: number) {
        this.setCode(code);
        this.setStatus(Status.Success);
    }
}

export const enum Status {
    None = "",
    Info = "info",
    Warning = "warn",
    Error = "err",
    Success = "scs",
}
