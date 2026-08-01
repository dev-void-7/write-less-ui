import { createSignal } from "solid-js";

const dflt = {
    columnDropdown: {
        expandCol: "Expand Column",
        shrinkCol: "Shrink Column",
        autoFitCol: "Auto Fit Column",
        sort: "Sort",
        asc: "Ascending",
        desc: "Descending",
    },
};

export type TbTranslations = typeof dflt;

const [_tbTranslations, _setTbTranslations] = createSignal(dflt);

export const tbTranslations = _tbTranslations;
export const setTbTranslations = _setTbTranslations;
