import { JSXElement } from "solid-js";

export interface Props<T> {
    items: Array<Item<T>>;
    ref: Api<T>;
}

export interface Item<T> {
    icon?: JSXElement;
    label: () => string;
    shortcut?: Array<string>;
    onclick: (data: T) => any;
}

export interface Api<T> {
    show: (item: T) => {};
}
