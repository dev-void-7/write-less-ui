import {  createMemo, For, JSXElement, Show } from "solid-js";
import { CheckIcon } from "../../../icons/CheckIcon.jsx";
import { useCtxMenuContext } from "../../CtxMenueContext.js";

export function ItemsRadio<T, V>(props: {
    items: Array<ItemRadioArgs<T, V>>;
    onclick: (data: T, val: V) => void;
    selected: (data: T, val: V) => boolean;
    iconPlaceholder?: JSXElement;
}) {
    return (
        <For each={props.items}>
            {(item, index) => (
                <ItemRadio
                    index={index()}
                    item={item}
                    iconPlaceholder={props.iconPlaceholder}
                    onclick={props.onclick}
                    selected={props.selected}
                />
            )}
        </For>
    );
}

function ItemRadio<T, V>(props: {
    index: number;
    item: ItemRadioArgs<T, V>;
    iconPlaceholder?: JSXElement;
    onclick: (data: T, val: V) => void;
    selected: (data: T, val: V) => boolean;
}) {
    const state = useCtxMenuContext<T>();
    const selected = createMemo(() => {
        return props.selected(state.data(), props.item.value);
    });

    return (
        <button
            type="button"
            class="wl--item"
            classList={{ "wl--hidden": props.item.hidden?.(state.data()), "wl--selected": selected() }}
            onclick={() => {
                const value = state.data();
                props.onclick(value, props.item.value);
                state.hidePopover();
            }}
        >
            {props.item.icon || props.iconPlaceholder}
            <div class="wl--label">{props.item.label()}</div>
            <div class="wl--expander"></div>
            <Shortcut items={props.item.shortcut} />
            <Show when={selected()}>
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

export interface ItemRadioArgs<T, V> {
    icon?: JSXElement;
    label: () => string;
    shortcut?: Array<string>;
    value: V;
    hidden?: (data: T) => boolean;
}
