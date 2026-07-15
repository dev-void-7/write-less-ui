import { For, Match, Show, Switch } from "solid-js";
import { type Props, Cols } from "./domain/index.js";
import { Foots } from "./domain/foots/foots.js";
import { ColLeaf } from "./domain/cols/col-leaf.js";
import { generateOnResizerMouseDown } from "./utils/resizing.js";
import { Col } from "./domain/cols/col.js";
import { ColGroup } from "./domain/cols/col-group.js";

export function Tb(props: Props) {
    const cols = new Cols(props);
    const foots = new Foots(props, cols.leafs, cols.orderedLeafs);
    let tb!: HTMLTableElement;
    return (
        <div class="wl--tb-wrapper">
            <table id={props.id} ref={tb}>
                <colgroup>
                    <For each={cols.orderedLeafs().filter((leaf) => !leaf.hidden())}>
                        {(leaf) => (
                            <col
                                style={{
                                    width: `${leaf.width()}px`,
                                }}
                            />
                        )}
                    </For>
                </colgroup>
                <THead cols={cols} />
                <tbody>
                    <For each={props.rows}>
                        {(row) => (
                            <tr>
                                <For each={cols.orderedLeafs()}>
                                    {(leaf) => (
                                        <td
                                            classList={{
                                                "wl--hidden": leaf.hidden(),
                                                "wl--no-print": leaf.hideOnPrint,
                                            }}
                                        >
                                            {row[leaf.idx]}
                                        </td>
                                    )}
                                </For>
                            </tr>
                        )}
                    </For>
                </tbody>
                <Show when={foots.orderedFootsAsRows()}>
                    <tfoot>
                        <For each={foots.orderedFootsAsRows()}>
                            {(row) => (
                                <tr>
                                    <For each={row}>
                                        {(foot) => (
                                            <td
                                                rowspan={foot.rowSpan}
                                                colspan={foot.colSpan()}
                                                classList={{
                                                    "wl--hidden": foot.hidden(),
                                                    "wl--visually-first-col": foots
                                                        .firstVisibleFoots()
                                                        .includes(foot),
                                                    "wl--visually-last-col": foots
                                                        .lastVisibleFoots()
                                                        .includes(foot),
                                                    "wl--no-print": foot.hideOnPrint(),
                                                }}
                                            >
                                                {foot.label()}
                                            </td>
                                        )}
                                    </For>
                                </tr>
                            )}
                        </For>
                    </tfoot>
                </Show>
            </table>
        </div>
    );
}

function THead(props: { cols: Cols }) {
    const cols = props.cols;
    return (
        <thead>
            <For each={cols.orderedColsAsRows()}>{(row) => <THeadTr cols={cols} row={row} />}</For>
        </thead>
    );
}

function THeadTr(props: { cols: Cols; row: Col[] }) {
    const cols = props.cols;
    return (
        <tr>
            <For each={props.row}>{(col) => <THeadTrTh cols={cols} col={col} />}</For>
        </tr>
    );
}

function THeadTrTh(props: { cols: Cols; col: Col }) {
    return (
        <Switch>
            <Match when={props.col instanceof ColGroup}>
                <THeadTrThGroup cols={props.cols} col={props.col as ColGroup} />
            </Match>
            <Match when={props.col instanceof ColLeaf}>
                <THeadTrThLeaf cols={props.cols} col={props.col as ColLeaf} />
            </Match>
        </Switch>
    );
}

function THeadTrThGroup(props: { cols: Cols; col: ColGroup }) {
    const cols = props.cols;
    return (
        <th
            colspan={props.col.colSpan()}
            rowSpan={props.col.rowSpan}
            classList={{
                "wl--hidden": props.col.hidden(),
                "wl--visually-first-col": cols.firstVisibleCols().includes(props.col),
            }}
        >
            <div class="wl--th-content">
                <div class="wl--th-label">{props.col.label()}</div>
            </div>
            <button
                type="button"
                class="wl--th-resizer"
                onmousedown={generateOnResizerMouseDown(props.col)}
            ></button>
        </th>
    );
}

function THeadTrThLeaf(props: { cols: Cols; col: ColLeaf }) {
    const cols = props.cols;
    return (
        <th
            colspan={props.col.colSpan()}
            rowSpan={props.col.rowSpan}
            classList={{
                "wl--hidden": props.col.hidden(),
                "wl--visually-first-col": cols.firstVisibleCols().includes(props.col),
            }}
            ref={props.col.thElem}
        >
            <div class="wl--th-content">
                <div class="wl--th-label">{props.col.label()}</div>
                <Show when={props.col.sortable}>
                    <div class="wl--th-sort"></div>
                </Show>
            </div>
            <button
                type="button"
                class="wl--th-resizer"
                onmousedown={generateOnResizerMouseDown(props.col)}
            ></button>
        </th>
    );
}

// so what?
/*
    table:
        - must write as less code as possible
        - supports hiding cols
        - supports col/row span
        - supports changing columns order
        - save the order of columns
        - supports sort/filter by column (only last child)
        - when hiding a column reduce colspan by colspan of column and if colspan is 0, hide the cell
        - do not allow moving column if it has a cell that spans outside of the column
        - to change sort use ondrag event which will modify the order array in the parent
*/

/*
    structure:
        - cols =
            Array<
                | string
                | () => string
                | {
                    label: ()=> string;
                    rowSpan?: number;
                    children: Array<Col>;
                    minWidth?: never;
                    sortable?: never;
                    hideOnExport?: never;
                    hideOnPrint?: never;
                    unhideable?: never;
                }
                | {
                    label: ()=> string;
                    rowSpan?: number;
                    minWidth?: string;
                    sortable?: boolean;
                    hideOnExport?: boolean;
                    hideOnPrint?: boolean;
                    unhideable?: boolean;
                    type?: Type;
                    children?: never;
                }
            >
*/

/**
 * 	issues:
 * 		- no-print in foots does not work (try to look at all cols
 * 		if they all has `no-print` then add the class to foot)
 *
 * 		- specifying the visually first and last cells does not work with hiding columns
 *
 */
