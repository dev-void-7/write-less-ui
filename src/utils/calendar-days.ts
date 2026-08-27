import { Range } from "../types/range.js";

export function calenderDays(
    year: number,
    month: Range<1, 12>,
): {
    preMonth: Array<Range<22, 31>>;
    month: Array<Range<1, 31>>;
    postMonth: Array<Range<1, 14>>;
} {
    const date = new Date(year, month, 0);
    const daysOfMonth = date.getDate();
    date.setDate(1);
    console.log(date.toString());
    const day = date.getDay();
    date.setDate(0);
    console.log(date.toString());
    const daysOfPreMonth = date.getDate();
    const preMonthDays = [];
    const monthDays = [];
    const postMonthDays = [];

    for (let i = 0; i < day; i++) {
        preMonthDays.unshift(daysOfPreMonth - i);
    }

    for (let i = 0; i < daysOfMonth; i++) {
        monthDays.push(i + 1);
    }

    for (let i = 0; i < 42 - daysOfMonth - day; i++) {
        postMonthDays.push(i + 1);
    }

    return {
        preMonth: preMonthDays as Array<Range<22, 31>>,
        month: monthDays as Array<Range<1, 31>>,
        postMonth: postMonthDays as Array<Range<1, 14>>,
    };
}
