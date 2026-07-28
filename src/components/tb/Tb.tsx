import { type Props, Cols } from "./domain/index.js";
import { Foots } from "./domain/foots/foots.js";
import { THead } from "./parts/THead.jsx";
import { ColGroup } from "./parts/ColGroup.jsx";
import { TBody } from "./parts/TBody.jsx";
import { TFoot } from "./parts/TFoot.jsx";
import { onMount } from "solid-js";
import { initVerticalScrolling } from "./utils/scrolling.js";
import { ArrowUpFillIcon } from "../icons/ArrowUpFill.jsx";
import { ArrowDownFillIcon } from "../icons/ArrowDownFill.jsx";
import { Api as CtxMenuApi } from "../ctx-menu/domain/props.js";
import { CtxMenu } from "./parts/CtxMenu.jsx";
import { Col } from "./domain/cols/col.js";

export function Tb(props: Props) {
    const cols = new Cols(props),
        foots = new Foots(props, cols.leafs, cols.orderedLeafs),
        ctxMenu = {} as CtxMenuApi<Col>;

    // eslint-disable no-unassigned-vars
    let tbWrapper!: HTMLDivElement,
        tb!: HTMLTableElement,
        verticalScrollbar!: HTMLDivElement,
        verticalScrollbarArrowUp!: HTMLButtonElement,
        verticalScrollbarArrowDown!: HTMLButtonElement,
        verticalThumbWrapper!: HTMLDivElement,
        verticalThumb!: HTMLButtonElement;
    // eslint-enable no-unassigned-vars

    onMount(() => {
        cols.distributeFreeSpaceToLeafsWithNoWidth();
        initVerticalScrolling(
            tbWrapper,
            tb,
            verticalScrollbar,
            verticalScrollbarArrowUp,
            verticalScrollbarArrowDown,
            verticalThumbWrapper,
            verticalThumb,
        );
    });

    return (
        <>
            <div class="wl--tb-frame">
                <div class="wl--tb-wrapper" ref={tbWrapper}>
                    <table id={props.id} ref={tb}>
                        <ColGroup cols={cols} />
                        <THead cols={cols} ctxMenu={ctxMenu} />
                        <TBody cols={cols} rows={props.rows} />
                        <TFoot foots={foots} />
                    </table>
                    <CtxMenu api={ctxMenu} />
                </div>
                <div class="wl--tb-thead-placeholder"></div>
                <div class="wl--tb-tfoot-placeholder"></div>
                <div class="wl--v-scrollbar" ref={verticalScrollbar}>
                    <button
                        type="button"
                        class="wl--arrow-up"
                        tabIndex="-1"
                        ref={verticalScrollbarArrowUp}
                    >
                        <ArrowUpFillIcon />
                    </button>
                    <div class="wl--thumb-wrapper" ref={verticalThumbWrapper}>
                        <button
                            type="button"
                            class="wl--thumb"
                            ref={verticalThumb}
                            tabIndex="-1"
                        ></button>
                    </div>
                    <button
                        type="button"
                        class="wl--arrow-down"
                        ref={verticalScrollbarArrowDown}
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
