import { type Props } from "./domain/index.js";
import { THead } from "./parts/THead.jsx";
import { ColGroup } from "./parts/ColGroup.jsx";
import { TBody } from "./parts/TBody.jsx";
import { TFoot } from "./parts/TFoot.jsx";
import { onMount } from "solid-js";
import { CtxMenu } from "./parts/CtxMenu.jsx";
import { State } from "./domain/state.js";
import { TbContext } from "./contexts/state.js";
import { VerticalScrollbar } from "./parts/VerticalScrollbar.jsx";
import { HorizontalScrollbar } from "./parts/HorizontalScrollbar.jsx";

export function Tb<S>(props: Props<S>) {
    const state = new State(props);
    const cols = state.cols;
    const elems = state.elems;

    onMount(() => {
        state.distributeFreeSpaceToLeafsWithNoWidth();
        state.observeTbWrapperLayoutAndOverflow();
        state.initScrolling();
    });

    return (
        <TbContext.Provider value={state}>
            <div class="wl--tb-frame">
                <div class="wl--tb-wrapper" ref={elems.tbWrapper}>
                    <table id={props.id} ref={elems.tb}>
                        <ColGroup cols={cols} />
                        <THead cols={cols} />
                        <TBody cols={cols} rows={props.rows} />
                        <TFoot foots={state.foots} />
                    </table>
                    <CtxMenu state={state} api={state.ctxMenu} />
                </div>
                <div class="wl--tb-thead-placeholder"></div>
                <div class="wl--tb-tfoot-placeholder"></div>
                <VerticalScrollbar elems={elems} />
                <HorizontalScrollbar elems={elems} />
            </div>
        </TbContext.Provider>
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
