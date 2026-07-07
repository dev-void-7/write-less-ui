import { For } from "solid-js";
import { type Props, Cols } from "./domain/index.js";

export function Tb(props: Props) {
    const cols = new Cols(props);
    console.log(cols.orderedLeafs());
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
                                            classList={{ hidden: col.hidden() }}
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
                                        <td classList={{ hidden: leaf.hidden() }}>
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
