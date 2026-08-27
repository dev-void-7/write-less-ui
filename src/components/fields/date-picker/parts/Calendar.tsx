import { Show } from "solid-js";
import { DaysView } from "./DaysView.jsx";
import { YearsView } from "./YearsView.jsx";
import { useDatePickerContext } from "../contexts/state.js";
import { View } from "../domain/state.js";

export function Calendar(props: { id: string }) {
    const state = useDatePickerContext();

    return (
        <div id={props.id} class="wl--calendar" popover>
            <div class="wl--head">
                <button class="wl--month-year">
                    <span class="wl--month"></span>
                    <span class="wl--year"></span>
                </button>
                <Show when={state.view() == View.Days}>
                    <button class="wl--next-month"></button>
                    <button class="wl--pre-month"></button>
                </Show>
            </div>
            <div class="wl--body">
                <YearsView />
                <DaysView />
            </div>
        </div>
    );
}
