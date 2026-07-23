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
    lastVisibleCols: Accessor<Array<Col>>;
    orderedColsAsRows: Accessor<Array<Array<Col>>>;
    orderedLeafs: Accessor<Array<ColLeaf>>;
    leafs: Accessor<Array<ColLeaf>>;
    depth: Accessor<number>;
    wrapper!: HTMLDivElement;
    tb!: HTMLTableElement;

    constructor(props: { id: string; cols: Array<ColArg> }) {
        [this.colsOrder, this.setColsOrder] = createSignal(
            getColOrder(props.id, props.cols.length),
        );
        this.depth = () => highestColsDepth(props.cols);
        console.log("depth", this.depth());
        this.cols = createMemo(() =>
            colsFromArgs(new Uint32Array([0]), props.cols, props.id, this.depth()),
        );
        this.orderedCols = createMemo(() => getOrderedCols(this.cols(), this.colsOrder()));
        this.firstVisibleCols = createMemo(() => detFirstVisibleCols(this.orderedCols()));
        this.lastVisibleCols = createMemo(() => detLastVisibleCols(this.orderedCols()));
        this.orderedColsAsRows = createMemo(() => orderedColsIntoRows(this.orderedCols()));
        this.orderedLeafs = createMemo(() => getLeafs(this.orderedCols()));
        this.leafs = createMemo(() => getLeafs(this.cols()));

        createEffect(() => this.setColsOrder(getColOrder(props.id, this.cols().length)));
    }

    distributeFreeSpaceToLeafsWithNoWidth() {
        const leafs = this.leafs().filter((leaf) => !leaf.width());
        if (leafs.length === 0) return;
        const freeSpace =
            parseFloat(getComputedStyle(this.wrapper).width) -
            parseFloat(getComputedStyle(this.tb).width);
        if (isNaN(freeSpace) || freeSpace <= 0) return;
        const width = freeSpace / leafs.length;
        leafs.forEach((leaf) => leaf.resizeBy(width));
    }
}

function colsFromArgs(
    idx: Uint32Array,
    args: Array<ColArg>,
    id: string,
    depth: number,
    curLvl: number = 0,
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
                new ColLeaf(
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
                new ColLeaf(`${id}.${i}`, idx[0]++, depth - curLvl, arg, firstInRow && i === 0),
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
    const lastVisible: Array<Col> = [];
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

function detLastVisibleCols(orderedCols: Array<Col>): Array<Col> {
    const lastVisible: Array<Col> = [];
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

function highestColsDepth(cols: Array<ColArg>, depth = 1) {
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
