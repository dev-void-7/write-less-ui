import { ItemNormalArgs, ItemsNormal } from "./items/Normal.jsx";
import { ItemRadioArgs, ItemsRadio } from "./items/Radio.jsx";
import { JSXElement, Match, Show, Switch } from "solid-js";

export function Group<T>(props: { group: GroupArgs<T>; iconPlaceholder?: JSXElement }) {
    return (
        <div class="wl--group" classList={{ "wl--hidden": props.group.hidden?.() }}>
            <Show when={props.group.title}>
                <div class="wl--title">{(props.group.title as () => string)()}</div>
            </Show>
            <Switch>
                <Match when={props.group.type == undefined || props.group.type == GroupType.Normal}>
                    <ItemsNormal
                        items={props.group.items}
                        iconPlaceholder={props.iconPlaceholder}
                    />
                </Match>
                <Match when={props.group.type == GroupType.Radio}>
                    <ItemsRadio
                        items={props.group.items as Array<ItemRadioArgs<T>>}
                        iconPlaceholder={props.iconPlaceholder}
                    />
                </Match>
            </Switch>
        </div>
    );
}

export type GroupArgs<T> = GroupNormalArgs<T> | GroupRadioArgs<T>;

export interface GroupNormalArgs<T> {
    title?: () => string;
    hidden?: () => boolean;
    type?: GroupType.Normal;
    items: Array<ItemNormalArgs<T>>;
}

export interface GroupRadioArgs<T> {
    title?: () => string;
    hidden?: () => boolean;
    type?: GroupType.Radio;
    items: Array<ItemRadioArgs<T>>;
}

export enum GroupType {
    Normal,
    Radio,
}
