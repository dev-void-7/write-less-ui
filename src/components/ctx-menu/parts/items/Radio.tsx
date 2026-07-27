import { Accessor, createMemo, createSignal, For, JSXElement, Setter, Show } from "solid-js";
import { CheckIcon } from "../../../icons/CheckIcon.jsx";
import { useCtxMenuContext } from "../../CtxMenueContext.js";

export function ItemsRadio<T>(props: {
    items: Array<ItemRadioArgs<T>>;
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
                />
            )}
        </For>
    );
}

function ItemRadio<T>(props: {
    index: number;
    item: ItemRadioArgs<T>;
    iconPlaceholder?: JSXElement;
    selected: Accessor<{ index: number; value: T }>;
    setSelected: Setter<{ index: number; value: T }>;
}) {
    const data = useCtxMenuContext<T>();
    const selected = createMemo(() => {
        const selected = props.selected();
        return selected.index === props.index && data() == selected.value;
    });
    return (
        <button
            type="button"
            class="wl--item"
            classList={{ "wl--hidden": props.item.hidden?.(), "wl--selected": selected() }}
            onclick={() => {
                const value = data();
                props.setSelected({ index: props.index, value });
                props.item.onclick(value);
            }}
        >
            {props.item.icon || props.iconPlaceholder}
            <div class="label">{props.item.label()}</div>
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

export interface ItemRadioArgs<T> {
    icon?: JSXElement;
    label: () => string;
    shortcut?: Array<string>;
    onclick: (data: T) => any;
    hidden?: () => boolean;
}
