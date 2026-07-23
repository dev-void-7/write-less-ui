export function watchScrollbarVisibility(
    tBodyOnlyTbWrapper: HTMLDivElement,
    tBodyOnlyTb: HTMLTableElement,
) {
    const observer = new ResizeObserver((_) => {
        if (isTrulyScrollable(tBodyOnlyTbWrapper)) {
            tBodyOnlyTbWrapper.classList.add("wl--scrollbar-is-visible");
        } else {
            tBodyOnlyTbWrapper.classList.remove("wl--scrollbar-is-visible");
        }
    });

    observer.observe(tBodyOnlyTbWrapper);
    observer.observe(tBodyOnlyTb);
}

function isTrulyScrollable(element: HTMLElement) {
    if (!element || element.scrollTop > 0) return true;

    element.scrollTop = 1;
    const scrolls = element.scrollTop > 0;
    element.scrollTop = 0; // Reset immediately

    return scrolls;
}
