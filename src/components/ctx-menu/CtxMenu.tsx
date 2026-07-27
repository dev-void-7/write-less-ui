import { For, JSXElement, Show } from "solid-js";
import { Group, Item, Props } from "./domain.js";

export function CtxMenu<T>(props: Props<T>) {
    // eslint-disable no-unassigned-vars
    let popover!: HTMLDivElement;
    // eslint-enable no-unassigned-vars
    const state = {
        data: undefined as T,
    };
    // @ts-ignore
    props.ref({
        show: (data: T) => {
            state.data = data;
            popover.showPopover();
        },
        hide: () => {
            popover.hidePopover();
        },
    });

    return (
        <div class="wl--ctx-menu" popover ref={popover}>
            <Groups groups={props.groups} state={state} />
        </div>
    );
}

function Groups<T>(props: { groups: Array<Group<T>>; state: { data: T } }) {
    return (
        <For each={props.groups}>
            {(group) => (
                <Group
                    group={group}
                    state={props.state}
                    iconPlaceholder={<IconPlaceHolder groups={props.groups} />}
                />
            )}
        </For>
    );
}

function Group<T>(props: { group: Group<T>; state: { data: T }; iconPlaceholder?: JSXElement }) {
    return (
        <div class="wl--group">
            <Items
                items={props.group.items}
                state={props.state}
                iconPlaceholder={props.iconPlaceholder}
            />
        </div>
    );
}

function Items<T>(props: {
    items: Array<Item<T>>;
    state: { data: T };
    iconPlaceholder?: JSXElement;
}) {
    return (
        <For each={props.items}>
            {(item) => (
                <Item item={item} state={props.state} iconPlaceholder={props.iconPlaceholder} />
            )}
        </For>
    );
}

function Item<T>(props: { item: Item<T>; state: { data: T }; iconPlaceholder?: JSXElement }) {
    return (
        <button type="button" class="wl--item" onclick={() => props.item.onclick(props.state.data)}>
            {props.item.icon || props.iconPlaceholder}
            <div class="label">{props.item.label()}</div>
            <Shortcut items={props.item.shortcut} />
        </button>
    );
}

function IconPlaceHolder<T>(props: { groups: Array<Group<T>> }) {
    return props.groups.some((group) => group.items.some((item) => item.icon)) ? (
        <span class="wl--icon-placeholder"></span>
    ) : undefined;
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
