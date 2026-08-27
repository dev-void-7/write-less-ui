import { For } from "solid-js";
import { useDatePickerContext } from "../contexts/state.js";

export function YearsView() {
    const state = useDatePickerContext();

    const years = () => {
        const year = state.sYear();
        const years = [];
        for (let i = year - 49; i < year; i++) {
            years.push(i);
        }
        years.push(year);
        for (let i = year + 1; i < year + 49; i++) {
            years.push(i);
        }
        return years;
    };

    return (
        <div class="wl--years">
            <For each={years()}>
                {(year) => (
                    <button
                        class="wl--day"
                        classList={{ "wl--selected": state.sYear() === year }}
                        onClick={() => state.selectYearAndSetViewToDays(year)}
                    >
                        {year}
                    </button>
                )}
            </For>
        </div>
    );
}
