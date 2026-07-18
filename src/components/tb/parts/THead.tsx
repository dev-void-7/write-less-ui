import { For, Match, Show, Switch } from "solid-js";
import { Cols } from "../domain/index.js";
import { Col } from "../domain/cols/col.js";
import { ColGroup } from "../domain/cols/col-group.js";
import { ColLeaf } from "../domain/cols/col-leaf.js";
import { generateOnResizerPointerDown } from "../utils/resizing.js";

export function THead(props: { cols: Cols }) {
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
                "wl--visually-last-col": cols.lastVisibleCols().includes(props.col),
            }}
        >
            <div class="wl--th-content">
                <div class="wl--th-label">{props.col.label()}</div>
            </div>
            <button
                type="button"
                class="wl--th-resizer"
                onpointerdown={generateOnResizerPointerDown(props.col)}
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
                "wl--visually-last-col": cols.lastVisibleCols().includes(props.col),
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
                onpointerdown={generateOnResizerPointerDown(props.col)}
            ></button>
        </th>
    );
}
