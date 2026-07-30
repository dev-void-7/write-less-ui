import { useCtxMenuContext } from "../CtxMenueContext.js";
import { ItemNormalArgs, ItemsNormal } from "./items/Normal.jsx";
import { ItemRadioArgs, ItemsRadio } from "./items/Radio.jsx";
import { JSXElement, Match, Show, Switch } from "solid-js";

export function Group<T, V>(props: { group: GroupArgs<T, V>; iconPlaceholder?: JSXElement }) {
    const state = useCtxMenuContext<T>();
    return (
        <div class="wl--group" classList={{ "wl--hidden": props.group.hidden?.(state.data()) }}>
            <Show when={props.group.title}>
                <div class="wl--title">{(props.group.title as () => string)()}</div>
            </Show>
            <Switch>
                <Match when={props.group.type == undefined || props.group.type == GroupType.Normal}>
                    <ItemsNormal
                        items={props.group.items as Array<ItemNormalArgs<T>>}
                        iconPlaceholder={props.iconPlaceholder}
                    />
                </Match>
                <Match when={props.group.type == GroupType.Radio}>
                    <ItemsRadio
                        items={props.group.items as Array<ItemRadioArgs<T, V>>}
                        onclick={(props.group as GroupRadioArgs<T, V>).onclick}
                        iconPlaceholder={props.iconPlaceholder}
                    />
                </Match>
            </Switch>
        </div>
    );
}

export type GroupArgs<T, V> = GroupNormalArgs<T> | GroupRadioArgs<T, V>;

export interface GroupNormalArgs<T> {
    title?: () => string;
    hidden?: (data: T) => boolean;
    onclick?: never;
    type?: GroupType.Normal;
    items: Array<ItemNormalArgs<T>>;
}

export interface GroupRadioArgs<T, V> {
    title?: () => string;
    hidden?: (data: T) => boolean;
    onclick: (data: T, val: V) => void;
    type?: GroupType.Radio;
    items: Array<ItemRadioArgs<T, V>>;
}

export enum GroupType {
    Normal,
    Radio,
}
