import { Accessor, createMemo, createSignal, For, JSXElement, Setter, Show } from "solid-js";
import { CheckIcon } from "../../../icons/CheckIcon.jsx";
import { useCtxMenuContext } from "../../CtxMenueContext.js";

export function ItemsRadio<T, V>(props: {
    items: Array<ItemRadioArgs<T, V>>;
    onclick: (data: T, val: V) => void;
    iconPlaceholder?: JSXElement;
}) {
    const [selected, setSelected] = createSignal({
        index: -1,
        value: undefined as T,
    });
    return (
        <For each={props.items}>
            {(item, index) => (
                <ItemRadio
                    index={index()}
                    item={item}
                    iconPlaceholder={props.iconPlaceholder}
                    selected={selected}
                    setSelected={setSelected}
                    onclick={props.onclick}
                />
            )}
        </For>
    );
}

function ItemRadio<T, V>(props: {
    index: number;
    item: ItemRadioArgs<T, V>;
    iconPlaceholder?: JSXElement;
    selected: Accessor<{ index: number; value: T }>;
    setSelected: Setter<{ index: number; value: T }>;
    onclick: (data: T, val: V) => void;
}) {
    const state = useCtxMenuContext<T>();
    const selected = createMemo(() => {
        const selected = props.selected();
        return selected.index === props.index && state.data() == selected.value;
    });

    return (
        <button
            type="button"
            class="wl--item"
            classList={{ "wl--hidden": props.item.hidden?.(state.data()), "wl--selected": selected() }}
            onclick={() => {
                const value = state.data();
                props.setSelected({ index: props.index, value });
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
