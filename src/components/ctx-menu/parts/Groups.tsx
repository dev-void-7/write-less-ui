import { For } from "solid-js";
import { Group, GroupArgs } from "./Group.jsx";

export function Groups<T>(props: { groups: Array<GroupArgs<T>> }) {
    return (
        <For each={props.groups}>
            {(group) => (
                <Group group={group} iconPlaceholder={<IconPlaceHolder groups={props.groups} />} />
            )}
        </For>
    );
}

function IconPlaceHolder<T>(props: { groups: Array<GroupArgs<T>> }) {
    return props.groups.some((group) => group.items.some((item) => item.icon)) ? (
        <span class="wl--icon-placeholder"></span>
    ) : undefined;
}
