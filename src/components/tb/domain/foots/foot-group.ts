import { Accessor, createMemo } from "solid-js";
import { Foot, FootArg } from "./foot.js";

export class FootGroup {
    label: () => string;
    colsCount: number;
    rowSpan?: number;
    children: Array<Foot>;
    colSpan: Accessor<number>;
    hidden: Accessor<boolean>;
    visuallyFirstInRow: boolean;
    hideOnPrint: Accessor<boolean>;
    hideOnExport: Accessor<boolean>;

    constructor(
        label: () => string,
        rowSpan: number,
        children: Array<Foot>,
        visuallyFirstInRow: boolean,
    ) {
        this.label = label;
        this.colsCount = children.reduce((acc, child) => acc + child.colsCount, 0);
        if (rowSpan > 1) this.rowSpan = rowSpan;
        this.children = children;
        this.colSpan = createMemo(() => {
            let span = 0;
            for (const child of this.children) {
                span += child.colSpan();
            }
            return span;
        });
        this.hidden = createMemo(() => this.colSpan() == 0);
        this.visuallyFirstInRow = visuallyFirstInRow;
        this.hideOnPrint = createMemo(() => {
            for (const child of this.children) {
                if (child.hideOnPrint()) return true;
            }
            return false;
        });
        this.hideOnExport = createMemo(() => {
            for (const child of this.children) {
                if (child.hideOnExport()) return true;
            }
            return false;
        });
    }
}

export type FootGroupArg = {
    label: () => string;
    children: Array<FootArg>;
    colSpan?: never;
    type?: never;
};

// [col1, col2, col3]
// [foot1, foot1, foot2]
//
//
//
//
