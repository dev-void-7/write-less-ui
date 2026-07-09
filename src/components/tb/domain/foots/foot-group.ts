import { Accessor, createMemo } from "solid-js";
import { Foot, FootArg } from "./foot.js";

export class FootGroup {
    label: () => string;
    rowSpan?: number;
    children: Array<Foot>;
    colSpan: Accessor<number>;
    hidden: Accessor<boolean>;
    visuallyFirstInRow: boolean;

    constructor(
        label: () => string,
        rowSpan: number,
        children: Array<Foot>,
        visuallyFirstInRow: boolean,
    ) {
        this.label = label;
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
