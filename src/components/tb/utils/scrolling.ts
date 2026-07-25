export function initVerticalScrolling(
    tbWrapper: HTMLDivElement,
    tb: HTMLTableElement,
    verticalScrollbar: HTMLDivElement,
    verticalScrollbarArrowUp: HTMLButtonElement,
    verticalScrollbarArrowDown: HTMLButtonElement,
    thumbWrapper: HTMLDivElement,
    thumb: HTMLButtonElement,
) {
    watchScrollbarVisibility(tbWrapper, tb, verticalScrollbar, thumbWrapper, thumb);
    setScrollTopByContinuously(tbWrapper, verticalScrollbarArrowUp, -1);
    setScrollTopByContinuously(tbWrapper, verticalScrollbarArrowDown, 1);
    setScrollTopByPageContinuously(tbWrapper, thumbWrapper, thumb);
}

function watchScrollbarVisibility(
    tbWrapper: HTMLDivElement,
    tb: HTMLTableElement,
    verticalScrollbar: HTMLDivElement,
    thumbWrapper: HTMLDivElement,
    thumb: HTMLButtonElement,
) {
    let scrollHandler: ((e: Event) => void) | undefined;
    let thumbWrapperWheelHandler: ((e: WheelEvent) => void) | undefined;
    const observer = new ResizeObserver((_) => {
        if (isTrulyScrollable(tbWrapper)) {
            verticalScrollbar.classList.add("wl--show");

            const wrapperHeight = parseFloat(getComputedStyle(tbWrapper).height);
            const contentHeight = parseFloat(getComputedStyle(tb).height);
            const thumbWrapperHeight = parseFloat(getComputedStyle(thumbWrapper).height);
            const thumbHeight = thumbWrapperHeight * (wrapperHeight / contentHeight);
            const availableWrapperScrolling = contentHeight - wrapperHeight;

            thumb.style.height = `${thumbHeight}px`;

            if (scrollHandler) tbWrapper.removeEventListener("scroll", scrollHandler);
            if (thumbWrapperWheelHandler)
                tbWrapper.removeEventListener("wheel", thumbWrapperWheelHandler);

            scrollHandler = generateScrollHandler(
                availableWrapperScrolling,
                thumbWrapperHeight - thumbHeight,
                thumb,
            );
            thumbWrapperWheelHandler = generateThumbWrapperWheelHandler(tbWrapper);

            tbWrapper.addEventListener("scroll", scrollHandler);
            verticalScrollbar.addEventListener("wheel", thumbWrapperWheelHandler, {
                passive: false,
            });
        } else {
            verticalScrollbar.classList.remove("wl--show");

            if (scrollHandler) tbWrapper.removeEventListener("scroll", scrollHandler);
            if (thumbWrapperWheelHandler)
                verticalScrollbar.removeEventListener("wheel", thumbWrapperWheelHandler);
        }
    });

    observer.observe(tbWrapper);
    observer.observe(tb);
}

function setScrollTopByContinuously(
    tbWrapper: HTMLDivElement,
    arrow: HTMLButtonElement,
    sign: 1 | -1,
) {
    let interval: number | undefined;
    arrow.addEventListener("pointerdown", (_e: PointerEvent) => {
        scrollTopBy(tbWrapper, 45 * sign);
        if (interval) clearInterval(interval);
        interval = setInterval(() => {
            scrollTopBy(tbWrapper, 45 * sign);
        }, 50);
    });
    arrow.addEventListener("pointerup", () => {
        if (interval) clearInterval(interval);
    });
    arrow.addEventListener("pointerleave", () => {
        if (interval) clearInterval(interval);
    });
}

function setScrollTopByPageContinuously(
    tbWrapper: HTMLDivElement,
    thumbWrapper: HTMLDivElement,
    thumb: HTMLButtonElement,
) {
    let interval: number | undefined;
    thumbWrapper.addEventListener("pointerdown", (e: PointerEvent) => {
        scrollTopByPage(tbWrapper, thumb, e);
        if (interval) clearInterval(interval);
        interval = setInterval(() => {
            scrollTopByPage(tbWrapper, thumb, e);
        }, 100);
    });
    thumbWrapper.addEventListener("pointerup", () => {
        if (interval) clearInterval(interval);
    });
    thumbWrapper.addEventListener("pointerleave", () => {
        if (interval) clearInterval(interval);
    });
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

function generateThumbWrapperWheelHandler(contentWrapper: HTMLDivElement) {
    return function (e: WheelEvent) {
        e.preventDefault();
        contentWrapper.scrollTop += e.deltaY;
    };
}

export function scrollTopBy(tbWrapper: HTMLDivElement, by: number) {
    tbWrapper.scrollBy({
        top: by,
        behavior: "smooth",
    });
}

export function scrollTopByPage(
    tbWrapper: HTMLDivElement,
    thumb: HTMLButtonElement,
    e: PointerEvent,
) {
    const thumbRect = thumb.getBoundingClientRect();
    if (
        e.clientX >= thumbRect.left &&
        e.clientX <= thumbRect.right &&
        e.clientY >= thumbRect.top &&
        e.clientY <= thumbRect.bottom
    ) {
        return;
    }
    if (e.target == thumb) return;
    const pageJump = tbWrapper.clientHeight - 20;

    if (e.clientY < thumbRect.top) {
        // Scroll up smoothly
        scrollTopBy(tbWrapper, -pageJump);
    } else {
        // Scroll down smoothly
        scrollTopBy(tbWrapper, pageJump);
    }
    // tbWrapper.scrollBy({
    //     top: by,
    //     behavior: "smooth",
    // });
}
