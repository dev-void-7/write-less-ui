import { JSX } from "solid-js";
import { Cols } from "../common/types.js";

export type Props = MainProps & FormId;

export interface MainProps {
    id?: string;
    children: JSX.Element;
    startIcon?: JSX.Element;
    endIcon?: JSX.Element;
    cols?: Cols;
    disalbed?: boolean;
    hidden?: boolean;
    type?: "button" | "submit";
}

type FormId =
    | {
          type: "submit";
          formId?: string;
      }
    | {
          type?: "button";
          formId?: never;
      };
