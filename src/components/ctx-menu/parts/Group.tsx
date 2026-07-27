import { ItemsNormal } from "./items/Normal.jsx";
import { ItemsRadio } from "./items/Radio.jsx";
import { Group, Type as GroupType } from "../domain/props.js";
import { JSXElement, Match, Switch } from "solid-js";

export function Group<T>(props: {
    group: Group<T>;
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
                        items={props.group.items}
                        state={props.state}
                        iconPlaceholder={props.iconPlaceholder}
                    />
                </Match>
            </Switch>
        </div>
    );
}
