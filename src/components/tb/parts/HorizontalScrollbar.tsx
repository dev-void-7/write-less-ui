import { ArrowLeftFillIcon } from "../../icons/ArrowLeftFill.jsx";
import { ArrowRightFillIcon } from "../../icons/ArrowRightFill.jsx";
import { Elems } from "../domain/elems.js";

export function HorizontalScrollbar(props: { elems: Elems }) {
    const elems = props.elems;
    return (
        <div dir="ltr" class="wl--h-scrollbar wl--hidden wl--no-print" ref={elems.horizontalScrollbar}>
            <button
                type="button"
                class="wl--arrow-left"
                tabIndex="-1"
                ref={elems.horizontalScrollbarArrowUp}
            >
                <ArrowLeftFillIcon />
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
                class="wl--arrow-right"
                ref={elems.horizontalScrollbarArrowDown}
                tabIndex="-1"
            >
                <ArrowRightFillIcon />
            </button>
        </div>
    );
}
