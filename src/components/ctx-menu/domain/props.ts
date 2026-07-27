import { GroupArgs } from "../parts/Group.jsx";

export interface Props<T> {
    groups: Array<GroupArgs<T>>;
    ref: Api<T>;
}

export interface Api<T> {
    show: (item: T, anchorName: string) => {};
    hide: () => {};
}
