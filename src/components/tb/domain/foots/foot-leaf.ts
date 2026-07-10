import { Accessor } from "solid-js/types/server/reactive.js";
import { ColLeaf } from "../cols/col-leaf.js";
import { createMemo } from "solid-js";

export class FootLeaf {
    label: () => string;
    cols: Array<ColLeaf>;
    rowSpan?: number;
    colSpan: Accessor<number>;
    type: Type;
    visuallyFirstInRow: boolean;
    hidden: Accessor<boolean>;
    hideOnPrint: Accessor<boolean>;
    hideOnExport: Accessor<boolean>;

    constructor(
        arg: FootLeafArg,
        rowSpan: number,
        cols: Array<ColLeaf>,
        visuallyFirstInRow: boolean,
    ) {
        this.label = arg.label;
        this.cols = cols;
        if (rowSpan > 1) this.rowSpan = rowSpan;
        this.colSpan = createMemo(() => {
            let colSpan = 0;
            for (const col of this.cols) {
                if (!col.hidden()) colSpan++;
            }
            return colSpan;
        });
        this.type = arg.type || Type.Text;
        this.visuallyFirstInRow = visuallyFirstInRow;
        this.hidden = createMemo(() => this.colSpan() == 0);
        this.hideOnPrint = createMemo(() => {
            for (const col of this.cols) {
                if (col.hidden()) continue;
                if (col.hideOnPrint) return true;
            }
            return false;
        });
        this.hideOnExport = createMemo(() => {
            for (const col of this.cols) {
                if (col.hidden()) continue;
                if (col.hideOnExport) return true;
            }
            return false;
        });
    }
}

export type FootLeafArg = {
    label: () => string;
    colSpan?: number;
    type?: Type;
    children?: never;
};

export const enum Type {
    Numeric,
    Text,
    DateTime,
    Boolean,
}
