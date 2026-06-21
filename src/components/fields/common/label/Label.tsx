import { Show } from "solid-js";
import { Props } from "./types.js";

export function Label(props: Props) {
    return (
        <Show when={props.label !== undefined}>
            <label
                class="wl--label"
                for={props.for}
            >
                {props.label}
                {props.required && <span class="required"> *</span>}
            </label>
        </Show>
    );
}
