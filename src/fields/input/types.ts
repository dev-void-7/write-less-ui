import { JSX, MergeProps } from "solid-js";
import { Cols } from "../common/types/types.js";

export type Merged<T extends Type> = MergeProps<
    [Props<T>, { id: string; type: Type; inputMode: InputMode; cols: Cols }]
>;

export type Props<T extends Type> = MainProps<T> &
    Required &
    Min &
    Max &
    PasswordStrength &
    Email;

export interface MainProps<T extends Type> {
    id?: string;
    label?: string;
    hint?: string;
    info?: string;
    placeholder?: string;
    startElem?: JSX.Element;
    endElem?: JSX.Element;
    startIcon?: JSX.Element;
    endIcon?: JSX.Element;
    cols?: Cols;
    key: string;
    disalbed?: boolean;
    hidden?: boolean;
    type?: T;
    inputMode?: InputMode;
    onValueChange?: (val: ValueMap[T]) => void;
    validator?: (val: ValueMap[T] | undefined) => number | undefined; // null means valid
    errCodes?: Array<number>;
    undefinedOnEmpty?: boolean;
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
          min: number;
          minCode: number;
      }
    | {
          min?: never;
          minCode?: never;
      };

export type Max =
    | {
          max: number;
          maxCode: number;
      }
    | {
          max?: never;
          maxCode?: never;
      };

export type PasswordStrength =
    | {
          type: "password";
          minStrength: number;
          minStrengthCode: number;
      }
    | {
          minStrength?: never;
          minStrengthCode?: never;
      };

export type Email =
    | {
          type: "email";
          invalidEmailCode: number;
      }
    | {
          type?: Exclude<Type, "email">;
          invalidEmailCode?: never;
      };

export type InputMode = "numeric" | "text" | "text" | "email" | "tel";

export type Type = "number" | "text" | "password" | "email" | "tel";

export type ValueMap = {
    number: number | undefined;
    text: string;
    password: string;
    email: string;
    tel: string;
};
