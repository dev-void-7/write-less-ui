import { Accessor, createEffect, createMemo, createSignal, Setter } from "solid-js";
import { Col, ColArg } from "./col.js";
import { ColLeaf } from "./col-leaf.js";
import { ColGroup } from "./col-group.js";
import { getColOrder, getOrderedCols } from "./common.js";

export class Cols<S = any> {
    cols: Accessor<Array<Col<S>>>;
    colsOrder: Accessor<Array<number>>;
    setColsOrder: Setter<Array<number>>;
    orderedCols: Accessor<Array<Col<S>>>;
    firstVisibleCols: Accessor<Array<Col<S>>>;
    lastVisibleCols: Accessor<Array<Col<S>>>;
    orderedColsAsRows: Accessor<Array<Array<Col<S>>>>;
    orderedLeafs: Accessor<Array<ColLeaf<S>>>;
    orderedVisibleLeafs: Accessor<Array<ColLeaf<S>>>;
    leafs: Accessor<Array<ColLeaf<S>>>;
    depth: Accessor<number>;

    constructor(props: { id: string; cols: Array<ColArg<S>> }) {
        [this.colsOrder, this.setColsOrder] = createSignal(
            getColOrder(props.id, props.cols.length),
        );
        this.depth = () => highestColsDepth(props.cols);
        this.cols = createMemo(() =>
            colsFromArgs(new Uint32Array([0]), props.cols, props.id, this.depth()),
        );
        this.orderedCols = createMemo(() => getOrderedCols(this.cols(), this.colsOrder()));
        this.firstVisibleCols = createMemo(() => detFirstVisibleCols(this.orderedCols()));
        this.lastVisibleCols = createMemo(() => detLastVisibleCols(this.orderedCols()));
        this.orderedColsAsRows = createMemo(() => orderedColsIntoRows(this.orderedCols()));
        this.orderedLeafs = createMemo(() => getLeafs(this.orderedCols()));
        this.orderedVisibleLeafs = createMemo(() =>
            getLeafs(this.orderedCols().filter((leaf) => !leaf.hidden())),
        );
        this.leafs = createMemo(() => getLeafs(this.cols()));

        createEffect(() => this.setColsOrder(getColOrder(props.id, this.cols().length)));
    }

    distributeFreeSpaceToLeafsWithNoWidth(freeSpace: number) {
        const leafs = this.leafs().filter((leaf) => !leaf.width());
        if (leafs.length === 0) return;
        if (isNaN(freeSpace) || freeSpace <= 0) return;
        const width = freeSpace / leafs.length;
        leafs.forEach((leaf) => leaf.resizeBy(width));
    }
}

function colsFromArgs<S>(
    idx: Uint32Array,
    args: Array<ColArg<S>>,
    id: string,
    depth: number,
    curLvl: number = 0,
    firstInRow: boolean = true,
): Array<Col<S>> {
    const cols = [];
    let arg: ColArg<S>;
    for (let i = 0; i < args.length; i++) {
        arg = args[i];
        if (typeof arg == "string") {
            const fixedLabel = arg;
            cols.push(
                new ColLeaf<S>(
                    `${id}.${i}`,
                    idx[0]++,
                    depth - curLvl,
                    {
                        label: () => fixedLabel,
                    },
                    firstInRow && i === 0,
                ),
            );
            continue;
        }
        if (typeof arg == "function") {
            cols.push(
                new ColLeaf<S>(
                    `${id}.${i}`,
                    idx[0]++,
                    depth - curLvl,
                    { label: arg },
                    firstInRow && i === 0,
                ),
            );
            continue;
        }

        if (!arg.children) {
            cols.push(
                new ColLeaf<S>(`${id}.${i}`, idx[0]++, depth - curLvl, arg, firstInRow && i === 0),
            );
            continue;
        }

        const children = colsFromArgs(
            idx,
            arg.children,
            `${id}.${i}`,
            depth,
            curLvl + 1,
            firstInRow && i === 0,
        );

        cols.push(new ColGroup(`${id}.${i}`, arg.label, 1, children, firstInRow && i === 0));
    }

    return cols;
}

function orderedColsIntoRows<S>(cols: Array<Col<S>>): Array<Array<Col<S>>> {
    const rows: Array<Array<Col<S>>> = [];
    orderedColsIntoRowsRecursively(cols, rows, 0);
    return rows;
}

function orderedColsIntoRowsRecursively<S>(
    cols: Array<Col<S>>,
    rows: Array<Array<Col<S>>>,
    rowIdx: number,
) {
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

function getLeafs<S>(cols: Array<Col<S>>): Array<ColLeaf<S>> {
    const leafs: Array<ColLeaf<S>> = [];
    for (let col of cols) {
        if (col instanceof ColLeaf) leafs.push(col);
        else if (col instanceof ColGroup) leafs.push(...getLeafs(col.children));
    }
    return leafs;
}

function detFirstVisibleCols<S>(orderedCols: Array<Col<S>>): Array<Col<S>> {
    const lastVisible: Array<Col<S>> = [];
    let col;
    for (let i = 0; i < orderedCols.length; i++) {
        col = orderedCols[i];
        if (col.hidden()) continue;
        lastVisible.push(col);
        if (col instanceof ColGroup) {
            lastVisible.push(...detFirstVisibleCols(col.orderedChildren()));
        }
        break;
    }
    return lastVisible;
}

function detLastVisibleCols<S>(orderedCols: Array<Col<S>>): Array<Col<S>> {
    const lastVisible: Array<Col<S>> = [];
    let col;
    for (let i = orderedCols.length - 1; i > -1; i--) {
        col = orderedCols[i];
        if (col.hidden()) continue;
        lastVisible.push(col);
        if (col instanceof ColGroup) {
            lastVisible.push(...detLastVisibleCols(col.orderedChildren()));
        }
        break;
    }
    return lastVisible;
}

function highestColsDepth<S>(cols: Array<ColArg<S>>, depth = 1) {
    let col,
        i,
        newDepth,
        highestDepth = depth;
    for (i = 0; i < cols.length; i++) {
        col = cols[i];
        if (typeof col == "string" || typeof col == "function" || !col.children) continue;
        newDepth = highestColsDepth(col.children, depth + 1);
        if (newDepth > highestDepth) highestDepth = newDepth;
    }
    return highestDepth;
}
