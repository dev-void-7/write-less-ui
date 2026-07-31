import { ArrowDownFillIcon } from "../../icons/ArrowDownFill.jsx";
import { ArrowUpFillIcon } from "../../icons/ArrowUpFill.jsx";
import { Elems } from "../domain/elems.js";

export function HorizontalScrollbar(props: { elems: Elems }) {
    const elems = props.elems;
    return (
        <div class="wl--h-scrollbar wl--hidden wl--no-print" ref={elems.horizontalScrollbar}>
            <button
                type="button"
                class="wl--arrow-start"
                tabIndex="-1"
                ref={elems.horizontalScrollbarArrowUp}
            >
                <ArrowUpFillIcon />
            </button>
            <div class="wl--thumb-wrapper" ref={elems.horizontalThumbWrapper}>
                <button
                    type="button"
                    class="wl--thumb"
                    ref={elems.horizontalThumb}
                    tabIndex="-1"
                ></button>
            </div>
            <button
                type="button"
                class="wl--arrow-end"
                ref={elems.horizontalScrollbarArrowDown}
                tabIndex="-1"
            >
                <ArrowDownFillIcon />
            </button>
        </div>
    );
}
