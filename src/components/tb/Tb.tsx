import { For } from "solid-js";
import { type Props, Cols } from "./domain/index.js";

export function Tb(props: Props) {
    const cols = new Cols(props);
    return (
        <div class="wl--tb-wrapper">
            <table id={props.id}>
                <thead>
                    <For each={cols.orderedColsAsRows()}>
                        {(row) => (
                            <tr>
                                <For each={row}>
                                    {(col) => (
                                        <th
                                            colspan={col.colSpan()}
                                            rowSpan={col.rowSpan}
                                            classList={{
                                                "wl--hidden": col.hidden(),
                                                "wl--visually-first-child": col.visuallyFirstInRow,
                                            }}
                                        >
                                            {col.label()}
                                        </th>
                                    )}
                                </For>
                            </tr>
                        )}
                    </For>
                </thead>
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
            </table>
        </div>
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
