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
    visuallyFirstInRow: boolean;

    constructor(
        id: string,
        label: () => string,
        rowSpan: number | undefined,
        children: Array<Col>,
        visuallyFirstInRow: boolean,
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
        this.visuallyFirstInRow = visuallyFirstInRow;
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

    canResizeBy(by: number): boolean {
        return this.getLastOrderedVisibleLeaf().canResizeBy(by);
    }

    canNotResizeBy(by: number): boolean {
        return this.getLastOrderedVisibleLeaf().canNotResizeBy(by);
    }

    resizeBy(by: number) {
        const visible = this.getVisibleCols();
        const perChild = by / visible.length;
        for (const child of visible) {
            child.resizeBy(perChild);
        }
    }

    increaseSizeBy(by: number) {
        const visible = this.getVisibleCols();
        const perChild = by / visible.length;
        for (const child of visible) {
            child.increaseSizeBy(perChild);
        }
    }

    computedWidth(): number {
        return this.getLastOrderedVisibleLeaf().computedWidth();
    }

    shrinkToMin() {
        for (const child of this.children) {
            child.shrinkToMin();
        }
    }

    getLastOrderedVisibleLeaf(): ColLeaf {
        for (const child of this.orderedChildren().toReversed()) {
            if (child.hidden()) continue;
            if (child instanceof ColLeaf) return child;
            return child.getLastOrderedVisibleLeaf();
        }
        // this must not happen
        throw new Error("No visible leaf found");
    }

    getVisibleCols(): Array<Col> {
        const visible = [];
        for (const child of this.children) {
            if (!child.hidden()) visible.push(child);
        }
        return visible;
    }
}

export type ColGroupArg = {
    label: () => string;
    children: Array<ColArg>;
    width?: never;
    sortable?: never;
    hideOnExport?: never;
    hideOnPrint?: never;
    unhideable?: never;
};
