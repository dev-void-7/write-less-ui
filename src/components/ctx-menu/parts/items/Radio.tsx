import { For, JSXElement, Show } from "solid-js";
import { CheckIcon } from "../../../icons/CheckIcon.jsx";

export function ItemsRadio<T>(props: {
    items: Array<ItemRadioArgs<T>>;
    state: { data: T };
    iconPlaceholder?: JSXElement;
}) {
    return (
        <For each={props.items}>
            {(item) => (
                <ItemRadio
                    item={item}
                    state={props.state}
                    iconPlaceholder={props.iconPlaceholder}
                />
            )}
        </For>
    );
}

function ItemRadio<T>(props: {
    item: ItemRadioArgs<T>;
    state: { data: T };
    iconPlaceholder?: JSXElement;
}) {
    return (
        <button
            type="button"
            class="wl--item"
            onclick={() => {
                props.item.onclick(props.state.data);
            }}
        >
            {props.item.icon || props.iconPlaceholder}
            <div class="label">{props.item.label()}</div>
            <Shortcut items={props.item.shortcut} />
            <Show when={props.item.selected}>
                <CheckIcon classList={{ "wl--check-icon": true }} />
            </Show>
        </button>
    );
}

function Shortcut(props: { items?: Array<string> }) {
    return (
        <Show when={props.items}>
            <div class="wl--shortcut">
                <For each={props.items}>{(item) => <span class="wl--item">{item}</span>}</For>
            </div>
        </Show>
    );
}

export interface ItemRadioArgs<T> {
    icon?: JSXElement;
    label: () => string;
    shortcut?: Array<string>;
    onclick: (data: T) => any;
    selected: boolean;
}
