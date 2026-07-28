import { createUniqueId, For, Match, Show, Switch } from "solid-js";
import { Cols } from "../domain/index.js";
import { Col } from "../domain/cols/col.js";
import { ColGroup } from "../domain/cols/col-group.js";
import { ColLeaf } from "../domain/cols/col-leaf.js";
import { generateOnResizerPointerDown } from "../utils/resizing.js";
import { MoreIcon } from "../../icons/More.jsx";
import { Api as CtxMenuApi } from "../../ctx-menu/domain/props.js";

export function THead(props: { cols: Cols; ctxMenu: CtxMenuApi<Col> }) {
    const cols = props.cols;
    return (
        <thead>
            <For each={cols.orderedColsAsRows()}>
                {(row) => <THeadTr cols={cols} row={row} ctxMenu={props.ctxMenu} />}
            </For>
        </thead>
    );
}

function THeadTr(props: { cols: Cols; row: Col[]; ctxMenu: CtxMenuApi<Col> }) {
    const cols = props.cols;
    return (
        <tr>
            <For each={props.row}>
                {(col) => <THeadTrTh cols={cols} col={col} ctxMenu={props.ctxMenu} />}
            </For>
        </tr>
    );
}

function THeadTrTh(props: { cols: Cols; col: Col; ctxMenu: CtxMenuApi<Col> }) {
    return (
        <Switch>
            <Match when={props.col instanceof ColGroup}>
                <THeadTrThGroup
                    cols={props.cols}
                    col={props.col as ColGroup}
                    ctxMenu={props.ctxMenu}
                />
            </Match>
            <Match when={props.col instanceof ColLeaf}>
                <THeadTrThLeaf
                    cols={props.cols}
                    col={props.col as ColLeaf}
                    ctxMenu={props.ctxMenu}
                />
            </Match>
        </Switch>
    );
}

function THeadTrThGroup(props: { cols: Cols; col: ColGroup; ctxMenu: CtxMenuApi<Col> }) {
    const cols = props.cols;

    function onMoreClick(this: HTMLButtonElement) {
        const anchorName = `--${createUniqueId()}`;
        this.style.anchorName = anchorName;
        props.ctxMenu.show(props.col, anchorName, () => {
            if (this.style.anchorName == anchorName) this.style.removeProperty("anchor-name");
        });
    }

    return (
        <th
            colspan={props.col.colSpan()}
            rowSpan={props.col.rowSpan}
            classList={{
                "wl--hidden": props.col.hidden(),
                "wl--visually-last-col": cols.lastVisibleCols().includes(props.col),
                "wl--visually-first-col": cols.firstVisibleCols().includes(props.col),
            }}
        >
            <div class="wl--th-content">
                <div class="wl--th-label">{props.col.label()}</div>
                <button type="button" class="wl--more" onclick={onMoreClick}>
                    <MoreIcon />
                </button>
            </div>
            <button
                type="button"
                class="wl--th-resizer"
                onpointerdown={generateOnResizerPointerDown(props.col)}
            ></button>
        </th>
    );
}

function THeadTrThLeaf(props: { cols: Cols; col: ColLeaf; ctxMenu: CtxMenuApi<Col> }) {
    const cols = props.cols;
    function onMoreClick(this: HTMLButtonElement) {
        const anchorName = `--${createUniqueId()}`;
        this.style.anchorName = anchorName;
        props.ctxMenu.show(props.col, anchorName, () => {
            if (this.style.anchorName == anchorName) this.style.removeProperty("anchor-name");
        });
    }
    return (
        <th
            colspan={props.col.colSpan()}
            rowSpan={props.col.rowSpan}
            classList={{
                "wl--hidden": props.col.hidden(),
                "wl--visually-last-col": cols.lastVisibleCols().includes(props.col),
                "wl--visually-first-col": cols.firstVisibleCols().includes(props.col),
            }}
            ref={props.col.thElem}
        >
            <div class="wl--th-content">
                <div class="wl--th-label">{props.col.label()}</div>
                <button type="button" class="wl--more" onclick={onMoreClick}>
                    <MoreIcon />
                </button>
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
