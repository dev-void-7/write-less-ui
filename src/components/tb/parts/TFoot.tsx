import { For, Show } from "solid-js";
import { Foots } from "../domain/foots/foots.js";
import { Foot } from "../domain/foots/foot.js";

export function TFoot(props: { foots: Foots }) {
    const foots = props.foots;

    return (
        <Show when={foots.orderedFootsAsRows()}>
            <tfoot>
                <For each={foots.orderedFootsAsRows()}>
                    {(row) => <Tr foots={foots} row={row} />}
                </For>
            </tfoot>
        </Show>
    );
}

function Tr(props: { foots: Foots; row: Array<Foot> }) {
    return (
        <tr>
            <For each={props.row}>{(foot) => <Td foots={props.foots} foot={foot} />}</For>
        </tr>
    );
}

function Td(props: { foots: Foots; foot: Foot }) {
    const foots = props.foots;
    return (
        <td
            rowspan={props.foot.rowSpan}
            colspan={props.foot.colSpan()}
            classList={{
                "wl--hidden": props.foot.hidden(),
                "wl--visually-first-col": foots.firstVisibleFoots().includes(props.foot),
                "wl--visually-last-col": foots.lastVisibleFoots().includes(props.foot),
                "wl--no-print": props.foot.hideOnPrint(),
            }}
        >
            {props.foot.label()}
        </td>
    );
}
