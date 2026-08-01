import { createContext, useContext } from "solid-js";

export const TranslationsContext = createContext<Translations>();
export const useTranslationsContext = () => {
    const translations = useContext(TranslationsContext);
    if (!translations) return dfltTranslations;
    return translations;
};

export type Translations = typeof dfltTranslations;

export const dfltTranslations = {
    tb: {
        columnDropdown: {
            expandCol: "Expand Column",
            shrinkCol: "Shrink Column",
            autoFitCol: "Auto Fit Column",
            sort: "Sort",
            asc: "Ascending",
            desc: "Descending",
        },
    },
};
