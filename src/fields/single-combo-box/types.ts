import { JSX, JSXElement, MergeProps } from "solid-js";

export type Merged<T, V, I> = MergeProps<
    [Props<T, V, I>, { id: string; perPage: number }]
>;

export type Props<T, V, I> = MainProps<T, V, I> & Required;

export interface MainProps<T, V, I> {
    id?: string;
    label?: string;
    hint?: string;
    info?: string;
    placeholder?: string;
    deselect?: string;
    // startElem?: JSX.Element;
    // endElem?: JSX.Element;
    startIcon?: JSX.Element;
    key: string;
    disabled?: boolean;
    hidden?: boolean;
    search: (
        key: string,
        page: number,
        perPage: number,
    ) => Promise<[count: number, items: Array<T>]>;
    mapToOpt: (t: T) => Opt<V, I>;
    onValueChange?: (val: V, item: I) => void;
    errCodes?: Array<number>;
    /** the number of options to fetch on every search */
    perPage?: number;
}

export type Opt<V, I> = {
    selectionLabel?: () => JSXElement;
    optLabel: () => JSXElement;
    value: V;
    item: I;
};

export type Required =
    | {
          required: true;
          requiredCode: number;
      }
    | {
          required?: false;
          requiredCode?: never;
      };

export const enum Status {
    Loading,
    Idle,
    Error,
}
