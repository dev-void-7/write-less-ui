import { GroupArgs } from "../parts/Group.jsx";

export interface Props<T> {
    groups: Array<GroupArgs<T>>;
    api: Api<T>;
}

export interface Api<T> {
    show: (item: T, anchorName: string, onHide?: () => void) => void;
    hide: () => void;
    isOpen: () => boolean;
}
