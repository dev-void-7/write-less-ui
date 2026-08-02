import { Accessor, createSignal } from "solid-js";
import { Toast, Type } from "./toast.js";

class ToasterState {
    toasts: Accessor<Array<Toast>>;
    setToasts: (toasts: Array<Toast>) => void;

    constructor() {
        [this.toasts, this.setToasts] = createSignal([]);
    }

    err(msg: string, duration?: number): number {
        return this.#toast(msg, Type.Error, duration);
    }

    scs(msg: string, duration?: number): number {
        return this.#toast(msg, Type.Success, duration);
    }

    warn(msg: string, duration?: number): number {
        return this.#toast(msg, Type.Warning, duration);
    }

    info(msg: string, duration?: number): number {
        return this.#toast(msg, Type.Info, duration);
    }

    #toast(content: string, type: Type, duration: number = 7000): number {
        const id = Math.ceil(Math.random() * 1000000);
        this.setToasts([
            ...this.toasts(),
            {
                id,
                content,
                type,
                duration,
            },
        ]);
        return id;
    }

    remove(id: number) {
        this.setToasts(this.toasts().filter((t) => t.id !== id));
    }
}

const toaster = new ToasterState();

export default toaster;
