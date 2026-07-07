import { JSXElement } from "solid-js";
import { ColArg } from "./cols/index.js";

export interface Props {
    id: string;
    classList?: string;
    label?: string;
    disabled?: boolean;
    cols: Array<ColArg>;
    rows: Array<Array<JSXElement>>;
    foots?: Array<any>;
    onRowClick?: (rowIndex: number) => void;
}
