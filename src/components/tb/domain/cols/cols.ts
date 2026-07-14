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
    firstVisibleCols: Accessor<Array<Col>>;
    orderedColsAsRows: Accessor<Array<Array<Col>>>;
    orderedLeafs: Accessor<Array<ColLeaf>>;
    leafs: Accessor<Array<ColLeaf>>;

    constructor(props: { id: string; cols: Array<ColArg> }) {
        [this.colsOrder, this.setColsOrder] = createSignal(
            getColOrder(props.id, props.cols.length),
        );

        this.cols = createMemo(() => colsFromArgs(new Uint32Array([0]), props.cols, props.id));
        this.orderedCols = createMemo(() => getOrderedCols(this.cols(), this.colsOrder()));
        this.firstVisibleCols = createMemo(() => detFirstVisibleCols(this.orderedCols()));
        this.orderedColsAsRows = createMemo(() => orderedColsIntoRows(this.orderedCols()));
        this.orderedLeafs = createMemo(() => getLeafs(this.orderedCols()));
        this.leafs = createMemo(() => getLeafs(this.cols()));

        createEffect(() => this.setColsOrder(getColOrder(props.id, this.cols().length)));
    }
}

function colsFromArgs(
    idx: Uint32Array,
    args: Array<ColArg>,
    id: string,
    firstInRow: boolean = true,
): Array<Col> {
    const cols = [];
    let arg: ColArg;
    for (let i = 0; i < args.length; i++) {
        arg = args[i];
        if (typeof arg == "string") {
            const fixedLabel = arg;
            cols.push(
                new ColLeaf(
                    `${id}.${i}`,
                    idx[0]++,
                    {
                        label: () => fixedLabel,
                    },
                    firstInRow && i === 0,
                ),
            );
            continue;
        }
        if (typeof arg == "function") {
            cols.push(new ColLeaf(`${id}.${i}`, idx[0]++, { label: arg }, firstInRow && i === 0));
            continue;
        }

        if (!arg.children) {
            cols.push(new ColLeaf(`${id}.${i}`, idx[0]++, arg, firstInRow && i === 0));
            continue;
        }

        const children = colsFromArgs(idx, arg.children, `${id}.${i}`, firstInRow && i === 0);
        cols.push(
            new ColGroup(`${id}.${i}`, arg.label, arg.rowSpan, children, firstInRow && i === 0),
        );
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

function getLeafs(cols: Array<Col>): Array<ColLeaf> {
    const leafs: Array<ColLeaf> = [];
    for (let col of cols) {
        if (col instanceof ColLeaf) leafs.push(col);
        else if (col instanceof ColGroup) leafs.push(...getLeafs(col.children));
    }
    return leafs;
}

function detFirstVisibleCols(orderedCols: Array<Col>): Array<Col> {
    const firstVisible: Array<Col> = [];
    for (const col of orderedCols) {
        if (col.hidden()) continue;
        firstVisible.push(col);
        if (col instanceof ColGroup)
            firstVisible.push(...detFirstVisibleCols(col.orderedChildren()));
        return firstVisible;
    }

    // it is possible that no visible col was found (e.g. all cols are hidden), return an empty array in that case
    return firstVisible;
}
