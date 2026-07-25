export function watchScrollbarVisibility(
    tbWrapper: HTMLDivElement,
    tb: HTMLTableElement,
    verticalScrollbar: HTMLDivElement,
    thumbWrapper: HTMLDivElement,
    thumb: HTMLButtonElement,
) {
    let scrollHandler: ((e: Event) => void) | undefined;
    let wheelHandler: ((e: WheelEvent) => void) | undefined;
    const observer = new ResizeObserver((_) => {
        if (isTrulyScrollable(tbWrapper)) {
            verticalScrollbar.classList.add("wl--show");
            const wrapperHeight = parseFloat(getComputedStyle(tbWrapper).height);
            const contentHeight = parseFloat(getComputedStyle(tb).height);
            const thumbWrapperHeight = parseFloat(getComputedStyle(thumbWrapper).height);
            const thumbHeight = thumbWrapperHeight * (wrapperHeight / contentHeight);
            thumb.style.height = `${thumbHeight}px`;
            if (scrollHandler) tbWrapper.removeEventListener("scroll", scrollHandler);
            if (wheelHandler) tbWrapper.removeEventListener("wheel", wheelHandler);
            scrollHandler = generateScrollHandler(
                contentHeight - wrapperHeight,
                thumbWrapperHeight - thumbHeight,
                thumb,
            );
            wheelHandler = generateWheelHandler(tbWrapper);
            tbWrapper.addEventListener("scroll", scrollHandler);
            verticalScrollbar.addEventListener("wheel", wheelHandler, { passive: false });
        } else {
            verticalScrollbar.classList.remove("wl--show");
            if (scrollHandler) tbWrapper.removeEventListener("scroll", scrollHandler);
            if (wheelHandler) verticalScrollbar.removeEventListener("wheel", wheelHandler);
        }
    });

    observer.observe(tbWrapper);
    observer.observe(tb);
}

function isTrulyScrollable(element: HTMLElement) {
    if (!element || element.scrollTop > 0) return true;

    element.scrollTop = 1;
    const scrolls = element.scrollTop > 0;
    element.scrollTop = 0; // Reset immediately

    return scrolls;
}

function generateScrollHandler(
    availableWrapperScrolling: number,
    availableThumbScrolling: number,
    thumb: HTMLButtonElement,
) {
    return function (this: HTMLElement, _e: Event) {
        const percent = this.scrollTop / availableWrapperScrolling;
        const thumbTranslateY = availableThumbScrolling * percent;
        thumb.style.transform = `translateY(${thumbTranslateY}px)`;
    };
}

function generateWheelHandler(contentWrapper: HTMLDivElement) {
    return function (e: WheelEvent) {
        e.preventDefault();
        console.log(e);
        contentWrapper.scrollTop += e.deltaY;
    };
}
