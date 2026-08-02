import { createEffect, For } from "solid-js";
import state from "./domain/toaster.js";
import { Toast } from "./Toast.jsx";

export function Toaster() {
    // oxlint-disable-next-line no-unassigned-vars
    let toaster!: HTMLDivElement;
    let oldLength = 0;

    createEffect(() => {
        const toasts = state.toasts();
        if (toasts.length > oldLength) {
            // this to always keep popover above everything
            toaster.hidePopover();
            toaster.showPopover();
        }
        oldLength = toasts.length;
    });

    return (
        <div class="wl--toaster" popover="manual" ref={toaster}>
            <For each={state.toasts()}>{(toast) => <Toast {...toast} />}</For>
        </div>
    );
}
