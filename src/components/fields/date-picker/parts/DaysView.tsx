import { createMemo, For } from "solid-js";
import { calenderDays } from "../../../../utils/calendar-days.js";
import { useDatePickerContext } from "../contexts/state.js";
import { Range } from "../../../../types/range.js";
import { datePickerTranslations } from "../../../../translations/date-picker.js";

export function DaysView() {
    const state = useDatePickerContext();

    const days = createMemo(() => calenderDays(state.sYear(), state.sMonth()));

    return (
        <div class="wl--days">
            <WeekDays />
            <Days days={days().preMonth} disabled={true} />
            <Days days={days().month} disabled={false} />
            <Days days={days().postMonth} disabled={true} />
        </div>
    );
}

function WeekDays() {
    return (
        <>
            <div class="wl--week-day">{datePickerTranslations().weekDays[0]}</div>
            <div class="wl--week-day">{datePickerTranslations().weekDays[1]}</div>
            <div class="wl--week-day">{datePickerTranslations().weekDays[2]}</div>
            <div class="wl--week-day">{datePickerTranslations().weekDays[3]}</div>
            <div class="wl--week-day">{datePickerTranslations().weekDays[4]}</div>
            <div class="wl--week-day">{datePickerTranslations().weekDays[5]}</div>
            <div class="wl--week-day">{datePickerTranslations().weekDays[6]}</div>
        </>
    );
}

function Days(props: { days: Array<Range<1, 31>>; disabled: boolean }) {
    const state = useDatePickerContext();

    const selected = props.disabled
        ? (_day: number) => false
        : (day: number) =>
              state.sDay() === day &&
              state.sMonth() == state.val.month &&
              state.sYear() == state.val.year;

    return (
        <For each={props.days}>
            {(day) => (
                <button
                    class="wl--day"
                    classList={{
                        "wl--selected": selected(day),
                    }}
                    disabled={props.disabled}
                    onClick={() => state.selectDayAndPickAndClose(day)}
                >
                    {day}
                </button>
            )}
        </For>
    );
}
