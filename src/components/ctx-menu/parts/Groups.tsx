import { For } from "solid-js";
import { Group } from "./Group.jsx";
import { type Group as GroupType } from "../domain/props.js";

export function Groups<T>(props: { groups: Array<GroupType<T>>; state: { data: T } }) {
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

function IconPlaceHolder<T>(props: { groups: Array<GroupType<T>> }) {
    return props.groups.some((group) => group.items.some((item) => item.icon)) ? (
        <span class="wl--icon-placeholder"></span>
    ) : undefined;
}
