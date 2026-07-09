import { JSXElement } from "solid-js";
import { ColArg } from "./cols/index.js";
import { FootArg } from "./foots/foot.js";

export interface Props {
    id: string;
    classList?: string;
    label?: string;
    disabled?: boolean;
    cols: Array<ColArg>;
    rows: Array<Array<JSXElement>>;
    foots?: Array<FootArg>;
    onRowClick?: (rowIndex: number) => void;
}
