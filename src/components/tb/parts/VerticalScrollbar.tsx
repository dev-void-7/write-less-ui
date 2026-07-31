import { ArrowDownFillIcon } from "../../icons/ArrowDownFill.jsx";
import { ArrowUpFillIcon } from "../../icons/ArrowUpFill.jsx";
import { Elems } from "../domain/elems.js";

export function VerticalScrollbar(props: { elems: Elems }) {
    const elems = props.elems;
    return (
        <div class="wl--v-scrollbar wl--hidden wl--no-print" ref={elems.verticalScrollbar}>
            <button
                type="button"
                class="wl--arrow-up"
                tabIndex="-1"
                ref={elems.verticalScrollbarArrowUp}
            >
                <ArrowUpFillIcon />
            </button>
            <div class="wl--thumb-wrapper" ref={elems.verticalThumbWrapper}>
                <button
                    type="button"
                    class="wl--thumb"
                    ref={elems.verticalThumb}
                    tabIndex="-1"
                ></button>
            </div>
            <button
                type="button"
                class="wl--arrow-down"
                ref={elems.verticalScrollbarArrowDown}
                tabIndex="-1"
            >
                <ArrowDownFillIcon />
            </button>
        </div>
    );
}
