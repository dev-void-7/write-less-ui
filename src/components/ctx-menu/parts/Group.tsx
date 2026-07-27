import { ItemNormalArgs, ItemsNormal } from "./items/Normal.jsx";
import { ItemRadioArgs, ItemsRadio } from "./items/Radio.jsx";
import { JSXElement, Match, Switch } from "solid-js";

export function Group<T>(props: {
    group: GroupArgs<T>;
    state: { data: T };
    iconPlaceholder?: JSXElement;
}) {
    return (
        <div class="wl--group">
            <Switch>
                <Match when={props.group.type == undefined || props.group.type == GroupType.Normal}>
                    <ItemsNormal
                        items={props.group.items}
                        state={props.state}
                        iconPlaceholder={props.iconPlaceholder}
                    />
                </Match>
                <Match when={props.group.type == GroupType.Radio}>
                    <ItemsRadio
                        items={props.group.items as Array<ItemRadioArgs<T>>}
                        state={props.state}
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
    type?: GroupType.Normal;
    items: Array<ItemNormalArgs<T>>;
}

export interface GroupRadioArgs<T> {
    title?: () => string;
    type?: GroupType.Radio;
    items: Array<ItemRadioArgs<T>>;
}

export enum GroupType {
    Normal,
    Radio,
}
