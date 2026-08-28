import { createSignal } from "solid-js";

const dflt = {
    weekDays: {
        0: "Su",
        1: "Mo",
        2: "Tu",
        3: "We",
        4: "Th",
        5: "Fr",
        6: "Sa",
    },
};

export type DatePickerTranslations = typeof dflt;

export const [datePickerTranslations, setDatePickerTranslations] = createSignal(dflt);
