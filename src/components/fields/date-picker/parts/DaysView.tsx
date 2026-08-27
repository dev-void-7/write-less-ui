import { createMemo, For } from "solid-js";
import { calenderDays } from "../../../../utils/calendar-days.js";
import { useDatePickerContext } from "../contexts/state.js";
import { Range } from "../../../../types/range.js";

export function DaysView() {
    const state = useDatePickerContext();

    const days = createMemo(() => calenderDays(state.sYear(), state.sMonth()));

    return (
        <div class="wl--days">
            <Days days={days().preMonth} disabled={true} />
            <Days days={days().month} disabled={false} />
            <Days days={days().postMonth} disabled={true} />
        </div>
    );
}

function Days(props: { days: Array<Range<1, 31>>; disabled: boolean }) {
    const state = useDatePickerContext();

    return (
        <For each={props.days}>
            {(day) => (
                <button
                    class="wl--day"
                    classList={{ "wl--selected": props.disabled == false && state.sDay() === day }}
                    disabled={props.disabled}
                    onClick={() => state.selectDayAndPickAndClose(day)}
                >
                    {day}
                </button>
            )}
        </For>
    );
}
