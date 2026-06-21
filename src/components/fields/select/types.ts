import { JSX, JSXElement, MergeProps } from "solid-js";
import { Cols } from "../common/types/types.js";

export type Merged<V, I> = MergeProps<
    [{ id: string; cols: Cols }, Props<V, I>]
>;

export type Props<V, I> = MainProps<V, I> & Required;

export interface MainProps<V, I> {
    id?: string;
    label?: string;
    hint?: string;
    info?: string;
    opts: Array<Opt<V, I>>;
    // startElem?: JSX.Element;
    // endElem?: JSX.Element;
    startIcon?: JSX.Element;
    cols?: Cols;
    key: string;
    disabled?: boolean;
    hidden?: boolean;
    onValueChange?: (val: V, item: I) => void;
    errCodes?: Array<number>;
}

export type Opt<V, I> = {
    label: () => JSXElement;
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
