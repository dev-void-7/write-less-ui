import { createUniqueId } from "solid-js";
import { CalenderOutlineIcon } from "../../../icons/CalenderOutline.jsx";
import { Calendar } from "./Calendar.jsx";
import { useDatePickerContext } from "../contexts/state.js";

export function MiddlePart() {
    const calenderId = createUniqueId();
    const state = useDatePickerContext();
    const merged = state.merged;

    const inputWrapper = (
        <>
            <button
                id={merged.id}
                class="wl--date-picker"
                type="button"
                ref={state.button}
                popovertarget={calenderId}
            >
                {merged.startIcon}
                <span class="wl--selected">{state.picked()}</span>
                <CalenderOutlineIcon classList={{ "wl--icon-calender": true }} />
            </button>
            <Calendar id={calenderId} />
        </>
    );

    if (merged.startElem || merged.endElem) {
        return (
            <div class="wl--middle-part">
                {merged.startElem}
                {inputWrapper}
                {merged.endElem}
            </div>
        );
    } else {
        return inputWrapper;
    }
}
