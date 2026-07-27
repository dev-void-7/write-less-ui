import { For, JSXElement, Show } from "solid-js";
import { GroupArgs } from "../Group.jsx";

export function ItemsNormal<T>(props: {
    items: Array<ItemNormalArgs<T>>;
    state: { data: T };
    iconPlaceholder?: JSXElement;
}) {
    return (
        <For each={props.items}>
            {(item) => (
                <ItemNormal item={item} state={props.state} iconPlaceholder={props.iconPlaceholder} />
            )}
        </For>
    );
}

function ItemNormal<T>(props: {
    item: ItemNormalArgs<T>;
    state: { data: T };
    iconPlaceholder?: JSXElement;
}) {
    return (
        <button type="button" class="wl--item" onclick={() => props.item.onclick(props.state.data)}>
            {props.item.icon || props.iconPlaceholder}
            <div class="label">{props.item.label()}</div>
            <Shortcut items={props.item.shortcut} />
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

export interface ItemNormalArgs<T> {
    icon?: JSXElement;
    label: () => string;
    shortcut?: Array<string>;
    onclick: (data: T) => any;
    sub?: Array<GroupArgs<T>>;
}
