import { Match, onMount, Switch } from "solid-js";
import { Toast as ToastProps, Type } from "./domain/toast.js";
import { ErrorXMarkAnimatedIcon } from "../icons/ErrorXMarkAnimated.jsx";
import { SuccessCheckMakrAnimatedIcon } from "../icons/SuccessCheckMarkAnimated.jsx";
import state from "./domain/toaster.js";

export function Toast(props: ToastProps) {
    // oxlint-disable-next-line no-unassigned-vars
    let toast!: HTMLDivElement;

    onMount(() => {
        toast.classList.add("wl--show");
        setTimeout(() => {
            toast.classList.remove("wl--show");
            setTimeout(() => {
                state.remove(props.id);
            }, 200);
        }, props.duration);
    });

    return (
        <div
            class="wl--toast"
            classList={{
                "wl--err": props.type === Type.Error,
                "wl--scs": props.type === Type.Success,
                "wl--warn": props.type === Type.Warning,
                "wl--info": props.type === Type.Info,
            }}
            ref={toast}
        >
            <div class="wl--vr"></div>
            <Switch>
                <Match when={props.type === Type.Error}>
                    <ErrorXMarkAnimatedIcon />
                </Match>
                <Match when={props.type === Type.Success}>
                    <SuccessCheckMakrAnimatedIcon />
                </Match>
            </Switch>
            {props.content}
        </div>
    );
}
