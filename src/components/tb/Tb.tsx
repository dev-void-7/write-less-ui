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
                <div
                    class="wl--tb-wrapper"
                    classList={{
                        "wl--expand": !props.shrink,
                    }}
                    ref={elems.tbWrapper}
                >
                    <table id={props.id} ref={elems.tb}>
                        <ColGroup cols={cols} />
                        <THead cols={cols} />
                        <TBody cols={cols} rows={props.rows} expansionRow={!props.shrink} />
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
