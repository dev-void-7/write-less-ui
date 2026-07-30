import { For } from "solid-js";
import { Group, GroupArgs } from "./Group.jsx";

export function Groups<T, V>(props: { groups: Array<GroupArgs<T, V>> }) {
    return (
        <For each={props.groups}>
            {(group) => (
                <Group group={group} iconPlaceholder={<IconPlaceHolder groups={props.groups} />} />
            )}
        </For>
    );
}

function IconPlaceHolder<T, V>(props: { groups: Array<GroupArgs<T, V>> }) {
    return props.groups.some((group) => group.items.some((item) => item.icon)) ? (
        <span class="wl--icon-placeholder"></span>
    ) : undefined;
}
