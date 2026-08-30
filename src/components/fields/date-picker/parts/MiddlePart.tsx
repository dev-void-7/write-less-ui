import { createUniqueId, Show } from "solid-js";
import { CalenderOutlineIcon } from "../../../icons/CalenderOutline.jsx";
import { Calendar } from "./Calendar.jsx";
import { useDatePickerContext } from "../contexts/state.js";
import { XIcon } from "../../../icons/X.jsx";

export function MiddlePart() {
    const calenderId = createUniqueId();
    const state = useDatePickerContext();
    const merged = state.merged;

    const inputWrapper = (
        <>
            <div class="wl--date-picker-wrapper">
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
                <Show when={state.picked() !== undefined}>
                    <button class="wl--btn-deselect" onClick={() => state.setPicked(undefined)}>
                        <XIcon classList={{ "wl--icon-deselect": true }} />
                    </button>
                </Show>
            </div>
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
