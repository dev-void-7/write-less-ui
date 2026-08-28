import { Show } from "solid-js";
import { DaysView } from "./DaysView.jsx";
import { YearsView } from "./YearsView.jsx";
import { useDatePickerContext } from "../contexts/state.js";
import { View } from "../domain/state.js";
import { ChevronLeftIcon } from "../../../icons/ChevronLeft.jsx";
import { ChevronRightIcon } from "../../../icons/ChevronRight.jsx";
import { ArrowDownOutlineIcon } from "../../../icons/ArrowDownOutlineIcon.jsx";

export function Calendar(props: { id: string }) {
    const state = useDatePickerContext();

    return (
        <div id={props.id} class="wl--dropdown" popover>
            <div class="wl--head">
                <button
                    type="button"
                    class="wl--month-year"
                    classList={{ "wl--expanded": state.view() == View.Years }}
                    onClick={() => state.toggleView()}
                >
                    {state.sMonth().toString().padStart(2, "0")} / {state.sYear()}
                    <ArrowDownOutlineIcon />
                </button>
                <Show when={state.view() == View.Days}>
                    <div class="wl--month-arrows" dir="ltr">
                        <button
                            type="button"
                            class="wl--pre-month"
                            onClick={() => state.selectPreMonth()}
                        >
                            <ChevronLeftIcon />
                        </button>
                        <button
                            type="button"
                            class="wl--next-month"
                            onClick={() => state.selectNextMonth()}
                        >
                            <ChevronRightIcon />
                        </button>
                    </div>
                </Show>
            </div>
            <div class="wl--body">
                <YearsView />
                <DaysView />
            </div>
        </div>
    );
}
