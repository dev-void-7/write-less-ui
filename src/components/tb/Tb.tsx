import { type Props } from "./domain/index.js";
import { THead } from "./parts/THead.jsx";
import { ColGroup } from "./parts/ColGroup.jsx";
import { TBody } from "./parts/TBody.jsx";
import { TFoot } from "./parts/TFoot.jsx";
import { onMount } from "solid-js";
import { initVerticalScrolling } from "./utils/scrolling.js";
import { ArrowUpFillIcon } from "../icons/ArrowUpFill.jsx";
import { ArrowDownFillIcon } from "../icons/ArrowDownFill.jsx";
import { CtxMenu } from "./parts/CtxMenu.jsx";
import { State } from "./domain/state.js";

export function Tb<S>(props: Props<S>) {
    const state = new State(props);

    onMount(() => {
        state.cols.distributeFreeSpaceToLeafsWithNoWidth();
        initVerticalScrolling(
            state.tbWrapper,
            state.tb,
            state.verticalScrollbar,
            state.verticalScrollbarArrowUp,
            state.verticalScrollbarArrowDown,
            state.verticalThumbWrapper,
            state.verticalThumb,
        );
    });

    return (
        <>
            <div class="wl--tb-frame">
                <div class="wl--tb-wrapper" ref={state.tbWrapper}>
                    <table id={props.id} ref={state.tb}>
                        <ColGroup cols={state.cols} />
                        <THead state={state} ctxMenu={state.ctxMenu} />
                        <TBody cols={state.cols} rows={props.rows} />
                        <TFoot foots={state.foots} />
                    </table>
                    <CtxMenu state={state} api={state.ctxMenu} />
                </div>
                <div class="wl--tb-thead-placeholder"></div>
                <div class="wl--tb-tfoot-placeholder"></div>
                <div class="wl--v-scrollbar" ref={state.verticalScrollbar}>
                    <button
                        type="button"
                        class="wl--arrow-up"
                        tabIndex="-1"
                        ref={state.verticalScrollbarArrowUp}
                    >
                        <ArrowUpFillIcon />
                    </button>
                    <div class="wl--thumb-wrapper" ref={state.verticalThumbWrapper}>
                        <button
                            type="button"
                            class="wl--thumb"
                            ref={state.verticalThumb}
                            tabIndex="-1"
                        ></button>
                    </div>
                    <button
                        type="button"
                        class="wl--arrow-down"
                        ref={state.verticalScrollbarArrowDown}
                        tabIndex="-1"
                    >
                        <ArrowDownFillIcon />
                    </button>
                </div>
                {/*<div class="wl--h-scrollbar"></div>*/}
            </div>

            {/*<div class="wl--tb-wrapper wl--no-print" ref={cols.wrapper}>
                <table id={props.id} ref={cols.tb}>
                    <ColGroup cols={cols} />
                    <THead cols={cols} />
                </table>
                <div
                    class="wl--tbody-only-tb-wrapper"
                    classList={{
                        "wl--scrollbar-is-block": scrollbarThickness > 0,
                    }}
                    ref={tBodyOnlyTbWrapper}
                >
                    <table id={props.id} ref={tBodyOnlyTb}>
                        <ColGroup cols={cols} />
                        <TBody cols={cols} rows={props.rows} />
                    </table>
                </div>
                <table id={props.id} class="wl--tfoot-only-tb">
                    <ColGroup cols={cols} />
                    <TFoot foots={foots} />
                </table>
                <div class="wl--tfoot-semi-border-top"></div>
            </div>*/}
        </>
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
