import { JSXElement, MergeProps } from "solid-js";
import { Cols } from "../../common/types/types.js";
import { DateObject } from "./date-object.js";

export type Merged<T extends Output> = MergeProps<
    [{ id: string; output: Output; cols: Cols }, Props<T>]
>;

export type Props<T extends Output> = MainProps<T> & Required & Min & Max;

export interface MainProps<T extends Output> {
    id?: string;
    label?: string;
    hint?: string;
    info?: string;
    startElem?: JSXElement;
    endElem?: JSXElement;
    startIcon?: JSXElement;
    cols?: Cols;
    key: string;
    disalbed?: boolean;
    hidden?: boolean;
    output?: T;
    dflt?: DateObject;
    onValueChange?: (val: OutputMap[T]) => void;
    // validator?: (val: ValueMap[T] | undefined) => number | undefined; // null means valid
    errCodes?: Array<number>;
}

export type Required =
    | {
          required: true;
          requiredCode: number;
      }
    | {
          required?: false;
          requiredCode?: never;
      };

export type Min =
    | {
          min: DateObject;
          minCode: number;
      }
    | {
          min?: never;
          minCode?: never;
      };

export type Max =
    | {
          max: DateObject;
          maxCode: number;
      }
    | {
          max?: never;
          maxCode?: never;
      };

export type Output = "object" | "text";

export type OutputMap = {
    object: DateObject;
    text: string;
};

// import { JSX, MergeProps } from "solid-js";
// import { Cols } from "../common/types/types.js";

// export type Merged<T extends Type> = MergeProps<
//     [{ id: string; type: Type; inputMode: InputMode; cols: Cols }, Props<T>]
// >;

// export type Props<T extends Type> = MainProps<T> &
//     Required &
//     Min &
//     Max &
//     PasswordStrength &
//     Email;

// export interface MainProps<T extends Type> {
//     id?: string;
//     label?: string;
//     hint?: string;
//     info?: string;
//     placeholder?: string;
//     startElem?: JSX.Element;
//     endElem?: JSX.Element;
//     startIcon?: JSX.Element;
//     endIcon?: JSX.Element;
//     cols?: Cols;
//     key: string;
//     disalbed?: boolean;
//     hidden?: boolean;
//     type?: T;
//     inputMode?: InputMode;
//     onValueChange?: (val: ValueMap[T]) => void;
//     validator?: (val: ValueMap[T] | undefined) => number | undefined; // null means valid
//     errCodes?: Array<number>;
//     undefinedOnEmpty?: boolean;
// }

// export type InputMode = "numeric" | "text" | "text" | "email" | "tel";

// export type Type = "number" | "text" | "password" | "email" | "tel";

// export type ValueMap = {
//     number: number | undefined;
//     text: string;
//     password: string;
//     email: string;
//     tel: string;
// };
