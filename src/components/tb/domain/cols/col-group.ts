import { Accessor, batch, createMemo, createSignal, Setter } from "solid-js";
import { Col, ColArg } from "./col.js";
import { getColOrder, getOrderedCols } from "./common.js";
import { ColLeaf } from "./col-leaf.js";

export class ColGroup {
    label: () => string;
    rowSpan?: number;
    children: Array<Col>;
    colSpan: Accessor<number>;
    hidden: Accessor<boolean>;

    colsOrder: Accessor<Array<number>>;
    setColsOrder: Setter<Array<number>>;

    orderedChildren: Accessor<Array<Col>>;

    constructor(
        id: string,
        label: () => string,
        rowSpan: number | undefined,
        children: Array<Col>,
    ) {
        this.label = label;
        this.rowSpan = rowSpan;
        this.children = children;
        [this.colsOrder, this.setColsOrder] = createSignal(getColOrder(id, children.length));

        this.orderedChildren = createMemo(() => getOrderedCols(this.children, this.colsOrder()));

        this.colSpan = createMemo(() => {
            let span = 0;
            for (const child of this.children) {
                if (child instanceof ColLeaf) {
                    if (!child.hidden()) span++;
                    continue;
                }

                span += child.colSpan();
            }
            return span;
        });

        this.hidden = createMemo(() => this.colSpan() == 0);
    }

    hide() {
        batch(() => {
            for (const child of this.children) {
                child.hide();
            }
        });
    }

    show() {
        batch(() => {
            for (const child of this.children) {
                child.show();
            }
        });
    }
}

export type ColGroupArg = {
    label: () => string;
    children: Array<ColArg>;
    rowSpan?: number;
    width?: never;
    sortable?: never;
    hideOnExport?: never;
    hideOnPrint?: never;
    unhideable?: never;
};
