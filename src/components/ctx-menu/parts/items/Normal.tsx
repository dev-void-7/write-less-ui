import { For, JSXElement, Show } from "solid-js";
import { GroupArgs } from "../Group.jsx";
import { useCtxMenuContext } from "../../CtxMenueContext.js";

export function ItemsNormal<T>(props: {
    items: Array<ItemNormalArgs<T>>;
    iconPlaceholder?: JSXElement;
}) {
    return (
        <For each={props.items}>
            {(item) => <ItemNormal item={item} iconPlaceholder={props.iconPlaceholder} />}
        </For>
    );
}

function ItemNormal<T>(props: { item: ItemNormalArgs<T>; iconPlaceholder?: JSXElement }) {
    const state = useCtxMenuContext<T>();
    return (
        <button
            type="button"
            class="wl--item"
            classList={{ "wl--hidden": props.item.hidden?.(state.data()) }}
            onclick={() => {
                props.item.onclick(state.data());
                state.hidePopover();
            }}
        >
            {props.item.icon || props.iconPlaceholder}
            <div class="wl--label">{props.item.label()}</div>
            <div class="wl--expander"></div>
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
    hidden?: (data: T) => boolean;
    sub?: Array<GroupArgs<T>>;
}
