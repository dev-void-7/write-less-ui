import { Show } from "solid-js";
import { DaysView } from "./DaysView.jsx";
import { YearsView } from "./YearsView.jsx";
import { useDatePickerContext } from "../contexts/state.js";
import { View } from "../domain/state.js";
import { ChevronLeftIcon } from "../../../icons/ChevronLeft.jsx";
import { ChevronRightIcon } from "../../../icons/ChevronRight.jsx";

export function Calendar(props: { id: string }) {
    const state = useDatePickerContext();

    return (
        <div id={props.id} class="wl--calendar" popover>
            <div class="wl--head">
                <button type="button" class="wl--month-year">
                    <span class="wl--month">{state.sMonth()}</span>
                    <span class="wl--year">{state.sYear()}</span>
                </button>
                <Show when={state.view() == View.Days}>
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
                </Show>
            </div>
            <div class="wl--body">
                <YearsView />
                <DaysView />
            </div>
        </div>
    );
}
