import { JSXElement } from "solid-js";
import { ColArg } from "./cols/index.js";
import { FootArg } from "./foots/foot.js";
import { SortedBy } from "./sorted-by.js";

export interface Props<S> {
    id: string;
    classList?: string;
    label?: string;
    disabled?: boolean;
    cols: Array<ColArg<S>>;
    rows: Array<Array<JSXElement>>;
    foots?: Array<FootArg>;
    onRowClick?: (rowIndex: number) => void;
    onSort?: (sortedBy: SortedBy<S> | undefined) => void;
    dfltSort?: SortedBy<S>;
}
