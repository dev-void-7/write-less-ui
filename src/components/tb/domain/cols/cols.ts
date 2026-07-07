import { Accessor, createEffect, createMemo, createSignal, Setter } from "solid-js";
import { Col, ColArg } from "./col.js";
import { ColLeaf } from "./col-leaf.js";
import { ColGroup } from "./col-group.js";
import { getColOrder, getOrderedCols } from "./common.js";

export class Cols {
    cols: Accessor<Array<Col>>;
    colsOrder: Accessor<Array<number>>;
    setColsOrder: Setter<Array<number>>;
    orderedCols: Accessor<Array<Col>>;
    orderedColsAsRows: Accessor<Array<Array<Col>>>;
    orderedLeafs: Accessor<Array<ColLeaf>>;

    constructor(props: { id: string; cols: Array<ColArg> }) {
        [this.colsOrder, this.setColsOrder] = createSignal(
            getColOrder(props.id, props.cols.length),
        );

        this.cols = createMemo(() => colsFromArgs(new Uint32Array([0]), props.cols, props.id));
        this.orderedCols = createMemo(() => getOrderedCols(this.cols(), this.colsOrder()));
        this.orderedColsAsRows = createMemo(() => orderedColsIntoRows(this.orderedCols()));
        this.orderedLeafs = createMemo(() => getOrderLeafs(this.orderedCols()));

        createEffect(() => this.setColsOrder(getColOrder(props.id, this.cols().length)));
    }
}

function colsFromArgs(idx: Uint32Array, args: Array<ColArg>, id: string): Array<Col> {
    const cols = [];
    let arg: ColArg;
    for (let i = 0; i < args.length; i++) {
        arg = args[i];
        if (typeof arg == "string") {
            const fixedLabel = arg;
            cols.push(
                new ColLeaf(idx[0]++, {
                    label: () => fixedLabel,
                }),
            );
            continue;
        }
        if (typeof arg == "function") {
            cols.push(new ColLeaf(idx[0]++, { label: arg }));
            continue;
        }

        if (!arg.children) {
            cols.push(new ColLeaf(idx[0]++, arg));
            continue;
        }

        const children = colsFromArgs(idx, arg.children, `${id}.${i}`);
        cols.push(new ColGroup(`${id}.${i}`, arg.label, arg.rowSpan, children));
    }

    return cols;
}

function orderedColsIntoRows(cols: Array<Col>): Array<Array<Col>> {
    const rows: Array<Array<Col>> = [];
    orderedColsIntoRowsRecursively(cols, rows, 0);
    return rows;
}

function orderedColsIntoRowsRecursively(cols: Array<Col>, rows: Array<Array<Col>>, rowIdx: number) {
    let row = rows[rowIdx];
    if (!row) row = rows[rowIdx] = [];
    let col;

    for (let colIdx = 0; colIdx < cols.length; colIdx++) {
        col = cols[colIdx];
        row.push(col);
        if (col instanceof ColGroup) {
            orderedColsIntoRowsRecursively(col.orderedChildren(), rows, rowIdx + 1);
        }
    }
}

function getOrderLeafs(cols: Array<Col>): Array<ColLeaf> {
    const leafs: Array<ColLeaf> = [];
    for (let col of cols) {
        if (col instanceof ColLeaf) leafs.push(col);
        else if (col instanceof ColGroup) leafs.push(...getOrderLeafs(col.orderedChildren()));
    }
    return leafs;
}
