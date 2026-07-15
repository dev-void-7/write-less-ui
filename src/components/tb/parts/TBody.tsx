import { For, JSXElement } from "solid-js";
import { Cols } from "../domain/index.js";
import { ColLeaf } from "../domain/cols/col-leaf.js";

export function TBody(props: { cols: Cols; rows: Array<Array<JSXElement>> }) {
    return (
        <tbody>
            <For each={props.rows}>{(row) => <Tr cols={props.cols} row={row} />}</For>
        </tbody>
    );
}

function Tr(props: { cols: Cols; row: Array<JSXElement> }) {
    return (
        <tr>
            <For each={props.cols.orderedLeafs()}>
                {(leaf) => <Td leaf={leaf} row={props.row} />}
            </For>
        </tr>
    );
}

function Td(props: { leaf: ColLeaf; row: Array<JSXElement> }) {
    return (
        <td
            classList={{
                "wl--hidden": props.leaf.hidden(),
                "wl--no-print": props.leaf.hideOnPrint,
            }}
        >
            {props.row[props.leaf.idx]}
        </td>
    );
}
