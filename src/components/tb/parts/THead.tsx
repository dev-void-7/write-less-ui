import { createUniqueId, For, Match, Switch } from "solid-js";
import { Col } from "../domain/cols/col.js";
import { ColGroup } from "../domain/cols/col-group.js";
import { ColLeaf } from "../domain/cols/col-leaf.js";
import { generateOnResizerPointerDown } from "../utils/resizing.js";
import { MoreIcon } from "../../icons/More.jsx";
import { SortDir } from "../../common/types.js";
import { ArrowLongDownIcon } from "../../icons/ArrowLongDown.jsx";
import { ArrowLongUpIcon } from "../../icons/ArrowLongUp.jsx";
import { Cols } from "../domain/index.js";
import { useTbContext } from "../contexts/state.js";

export function THead<S>(props: { cols: Cols<S> }) {
    return (
        <thead>
            <For each={props.cols.orderedColsAsRows()}>
                {(row) => <THeadTr row={row} />}
            </For>
        </thead>
    );
}

function THeadTr<S>(props: { row: Col<S>[]; }) {
    return (
        <tr>
            <For each={props.row}>
                {(col) => <THeadTrTh col={col} />}
            </For>
        </tr>
    );
}

function THeadTrTh<S>(props: { col: Col<S>; }) {
    return (
        <Switch>
            <Match when={props.col instanceof ColGroup}>
                <THeadTrThGroup
                    col={props.col as ColGroup<S>}
                />
            </Match>
            <Match when={props.col instanceof ColLeaf}>
                <THeadTrThLeaf
                    col={props.col as ColLeaf<S>}
                />
            </Match>
        </Switch>
    );
}

function THeadTrThGroup<S>(props: {
    col: ColGroup<S>;
}) {
    const state = useTbContext<S>();
    const cols = state.cols;
    const ctxMenu = state.ctxMenu;

    function onMoreClick(this: HTMLButtonElement) {
        const anchorName = `--${createUniqueId()}`;
        this.style.anchorName = anchorName;
        ctxMenu.show(props.col, anchorName, () => {
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
                onpointerdown={generateOnResizerPointerDown(props.col, state.elems.tb)}
            ></button>
        </th>
    );
}

function THeadTrThLeaf<S>(props: {
    col: ColLeaf<S>;
}) {
    const state = useTbContext<S>();
    const cols = state.cols;
    const ctxMenu = state.ctxMenu;

    function onMoreClick(this: HTMLButtonElement) {
        const anchorName = `--${createUniqueId()}`;
        this.style.anchorName = anchorName;
        ctxMenu.show(props.col, anchorName, () => {
            if (this.style.anchorName == anchorName) this.style.removeProperty("anchor-name");
        });
    }

    const sortedIcon = () => {
        const sorted = state.sorted;
        if (!sorted) return;
        const by = sorted.by();
        if (by === undefined || by.key !== props.col.sortKey) return;
        if (by.dir == SortDir.Asc) return <ArrowLongUpIcon />;
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
                onpointerdown={generateOnResizerPointerDown(props.col, state.elems.tb)}
            ></button>
        </th>
    );
}
