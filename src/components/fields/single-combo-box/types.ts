import { JSX, JSXElement, MergeProps } from "solid-js";
import { Cols } from "../common/types/types.js";

export type Merged<T, V, I> = MergeProps<
    [{ id: string; perPage: number; cols: Cols }, Props<T, V, I>]
>;

export type Props<T, V, I> = MainProps<T, V, I> & Required;

export interface MainProps<T, V, I> {
    id?: string;
    label?: string;
    hint?: string;
    info?: string;
    placeholder?: string;
    // startElem?: JSX.Element;
    // endElem?: JSX.Element;
    startIcon?: JSX.Element;
    cols?: Cols;
    key: string;
    disabled?: boolean;
    hidden?: boolean;
    search: (
        key: string,
        page: number,
        perPage: number,
    ) => Promise<[count: number, items: Array<T>]>;
    mapToOpt: (t: T) => Opt<V, I>;
    onValueChange?: (opt?: Opt<V, I>) => void;
    errCodes?: Array<number>;
    /** the number of options to fetch on every search */
    perPage?: number;
}

export type Opt<V, I> = {
    selectionLabel?: () => JSXElement;
    optLabel: (key: string) => JSXElement;
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
