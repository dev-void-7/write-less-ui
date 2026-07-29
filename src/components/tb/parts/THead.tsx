import { createUniqueId, For, Match, Switch } from "solid-js";
import { Col } from "../domain/cols/col.js";
import { ColGroup } from "../domain/cols/col-group.js";
import { ColLeaf } from "../domain/cols/col-leaf.js";
import { generateOnResizerPointerDown } from "../utils/resizing.js";
import { MoreIcon } from "../../icons/More.jsx";
import { Api as CtxMenuApi } from "../../ctx-menu/domain/props.js";
import { State } from "../domain/state.js";
import { SortDir } from "../../common/types.js";
import { ArrowLongDownIcon } from "../../icons/ArrowLongDown.jsx";
import { ArrowLongUpIcon } from "../../icons/ArrowLongUp.jsx";

export function THead<S>(props: { state: State<S>; ctxMenu: CtxMenuApi<Col<S>> }) {
    return (
        <thead>
            <For each={props.state.cols.orderedColsAsRows()}>
                {(row) => <THeadTr state={props.state} row={row} ctxMenu={props.ctxMenu} />}
            </For>
        </thead>
    );
}

function THeadTr<S>(props: { state: State<S>; row: Col<S>[]; ctxMenu: CtxMenuApi<Col<S>> }) {
    return (
        <tr>
            <For each={props.row}>
                {(col) => <THeadTrTh state={props.state} col={col} ctxMenu={props.ctxMenu} />}
            </For>
        </tr>
    );
}

function THeadTrTh<S>(props: { state: State<S>; col: Col<S>; ctxMenu: CtxMenuApi<Col<S>> }) {
    return (
        <Switch>
            <Match when={props.col instanceof ColGroup}>
                <THeadTrThGroup
                    state={props.state}
                    col={props.col as ColGroup<S>}
                    ctxMenu={props.ctxMenu}
                />
            </Match>
            <Match when={props.col instanceof ColLeaf}>
                <THeadTrThLeaf
                    state={props.state}
                    col={props.col as ColLeaf<S>}
                    ctxMenu={props.ctxMenu}
                />
            </Match>
        </Switch>
    );
}

function THeadTrThGroup<S>(props: {
    state: State<S>;
    col: ColGroup<S>;
    ctxMenu: CtxMenuApi<Col<S>>;
}) {
    const cols = props.state.cols;

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

function THeadTrThLeaf<S>(props: {
    state: State<S>;
    col: ColLeaf<S>;
    ctxMenu: CtxMenuApi<Col<S>>;
}) {
    const cols = props.state.cols;
    function onMoreClick(this: HTMLButtonElement) {
        const anchorName = `--${createUniqueId()}`;
        this.style.anchorName = anchorName;
        props.ctxMenu.show(props.col, anchorName, () => {
            if (this.style.anchorName == anchorName) this.style.removeProperty("anchor-name");
        });
    }

    const sortedIcon = () => {
        const sorted = props.state.sorted;
        if (!sorted) return;
        const by = sorted.by();
        if (by === undefined || by.key !== props.col.sortKey) return;
        if (by.dir == SortDir.Asc) return <ArrowLongUpIcon/>;
        else return <ArrowLongDownIcon />;
    };

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
                {sortedIcon()}
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
