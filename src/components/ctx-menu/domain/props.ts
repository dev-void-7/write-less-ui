import { JSXElement } from "solid-js";

export interface Props<T> {
    groups: Array<Group<T>>;
    ref: Api<T>;
}

export interface Group<T> {
    title?: () => string;
    type?: Type;
    items: Array<Item<T>>;
}

export interface Item<T> {
    icon?: JSXElement;
    label: () => string;
    shortcut?: Array<string>;
    onclick: (data: T) => any;
    sub?: Array<Group<T>>;
}

export interface Api<T> {
    show: (item: T) => {};
}

export enum Type {
    Normal,
    Radio,
}
