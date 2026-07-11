import { Accessor, createMemo } from "solid-js";
import { Foot, FootArg } from "./foot.js";
import { FootLeaf } from "./foot-leaf.js";
import { FootGroup } from "./foot-group.js";
import { ColLeaf } from "../cols/col-leaf.js";

export class Foots {
    colLeafs: Accessor<Array<ColLeaf>>;
    orderedColLeafs: Accessor<Array<ColLeaf>>;
    colLeafsOrder: Accessor<Array<number>>;
    foots: Accessor<Array<Foot> | undefined>;
    orderedFootsAsRows: Accessor<Array<Array<Foot>> | undefined>;
    depth: number;

    constructor(
        props: { id: string; foots?: Array<FootArg> },
        colLeafs: Accessor<Array<ColLeaf>>,
        orderedColLeafs: Accessor<Array<ColLeaf>>,
    ) {
        this.colLeafs = colLeafs;
        this.orderedColLeafs = orderedColLeafs;
        this.colLeafsOrder = createMemo(() => this.orderedColLeafs().map((leaf) => leaf.idx));
        this.depth = highestFootsDepth(props.foots ?? []);
        this.foots = createMemo(() =>
            footsFromArgs(props.foots, props.id, this.colLeafs(), this.depth),
        );
        this.orderedFootsAsRows = createMemo(() =>
            orderFootsIntoRows(this.foots(), this.colLeafsOrder(), this.depth),
        );
    }
}

function footsFromArgs(
    args: Array<FootArg> | undefined,
    id: string,
    colLeafs: Array<ColLeaf>,
    depth: number,
): Array<Foot> | undefined {
    if (!args) return undefined;
    return footsFromArgsRecursively(args, id, colLeafs, depth);
}

function footsFromArgsRecursively(
    args: Array<FootArg>,
    id: string,
    colLeafs: Array<ColLeaf>,
    depth: number,
    curLvl: number = 0,
    colLeafIdx: Uint32Array = new Uint32Array([0]),
    firstInRow: boolean = true,
): Array<Foot> {
    const foots = [];
    let arg: FootArg;
    for (let i = 0; i < args.length; i++) {
        arg = args[i];
        console.log(
            "arg",
            arg,
            ", colLeafIdx:",
            colLeafIdx[0],
            "target col",
            colLeafs[colLeafIdx[0]],
        );
        if (typeof arg == "string") {
            const fixedLabel = arg;
            foots.push(
                new FootLeaf(
                    {
                        label: () => fixedLabel,
                    },
                    depth - curLvl,
                    colLeafs.slice(colLeafIdx[0], colLeafIdx[0] + 1),
                    firstInRow && i === 0,
                ),
            );
            colLeafIdx[0]++;
            continue;
        }
        if (typeof arg == "function") {
            foots.push(
                new FootLeaf(
                    { label: arg },
                    depth - curLvl,
                    colLeafs.slice(colLeafIdx[0], colLeafIdx[0] + 1),
                    firstInRow && i === 0,
                ),
            );
            colLeafIdx[0]++;
            continue;
        }

        if (!arg.children) {
            const colSpan = arg.colSpan || 1;
            foots.push(
                new FootLeaf(
                    arg,
                    depth - curLvl,
                    colLeafs.slice(colLeafIdx[0], colLeafIdx[0] + colSpan),
                    firstInRow && i === 0,
                ),
            );
            colLeafIdx[0] += colSpan;
            continue;
        }

        const groupHighestDepth = highestFootsDepth(arg.children);

        const children = footsFromArgsRecursively(
            arg.children,
            `${id}.${i}`,
            colLeafs,
            depth,
            curLvl + 1,
            colLeafIdx,
            firstInRow && i === 0,
        );

        foots.push(
            new FootGroup(
                arg.label,
                depth - curLvl - groupHighestDepth,
                children,
                firstInRow && i === 0,
            ),
        );
    }

    return foots;
}

function highestFootsDepth(foots: Array<FootArg>, depth = 1) {
    let foot, i, newDepth;
    for (i = 0; i < foots.length; i++) {
        foot = foots[i];
        if (typeof foot == "string" || typeof foot == "function" || !foot.children) continue;
        newDepth = highestFootsDepth(foot.children, depth + 1);
        if (newDepth > depth) depth = newDepth;
    }
    return depth;
}

function orderFootsIntoRows(
    foots: Array<Foot> | undefined,
    colLeafsOrder: Array<number>,
    depth: number,
): Array<Array<Foot>> | undefined {
    if (!foots) return undefined;
    const rows: Array<Array<Foot>> = Array.from({ length: depth }).map(() => []);
    orderFootsIntoRowsRecursively(foots, colLeafsOrder, new Uint32Array([0]), rows, depth);
    // remove empty `empty` (`[1, empty, 3]`) from array
    const filtered = [];
    for (const row of rows) {
        filtered.push(row.filter((_) => true));
    }
    return filtered;
}

function orderFootsIntoRowsRecursively(
    foots: Array<Foot>,
    colLeafsOrder: Array<number>,
    orderedIdx: Uint32Array,
    rows: Array<Array<Foot>>,
    depth: number,
    lvl: number = 0,
) {
    // it is impossible for `row` to be `undefined` here, as `rows` is initialized with `depth` empty arrays
    // if (!row) row = rows[rowIdx] = [];
    //
    let foot;
    let position;

    for (let i = 0; i < foots.length; i++) {
        foot = foots[i];
        /**
         * this will get the place in which the foot should be placed BUT!!! regardless of colspan
         * which might create gaps in the row array which will be solved by the `filter` call above at {@link orderFootsIntoRows}.
         */
        position = colLeafsOrder[orderedIdx[0]];
        rows[depth - (foot.rowSpan || 1) - lvl][position] = foot;
        if (foot instanceof FootGroup) {
            orderFootsIntoRowsRecursively(
                foot.children,
                colLeafsOrder,
                orderedIdx,
                rows,
                depth,
                lvl + 1,
            );
        } else {
            orderedIdx[0] += foot.cols.length;
        }
    }
}
