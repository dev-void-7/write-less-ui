export function watchScrollbarVisibility(
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

// function generateTbWrapperWheelHandler(availableWrapperScrolling: number) {
//     return function (this: HTMLElement, e: WheelEvent) {
//         if (e.deltaY == 0) return;
//         if (e.deltaY > 0) {
//             const wrapperRemainingScroll = availableWrapperScrolling - this.scrollTop;
//             if (wrapperRemainingScroll >= e.deltaY) return;

//             e.preventDefault();
//             e.stopImmediatePropagation();
//             e.stopPropagation();
//             this.scrollBy({ top: wrapperRemainingScroll, behavior: "auto" });
//             if (this.parentElement) {
//                 this.parentElement.scrollBy({
//                     top: e.deltaY - wrapperRemainingScroll,
//                     behavior: "auto",
//                 });
//             }
//         } else if (e.deltaY < 0) {
//             if (this.scrollTop + e.deltaY >= 0) return;
//             e.preventDefault();
//             e.stopImmediatePropagation();
//             e.stopPropagation();
//             const oldScrollTop = this.scrollTop;
//             this.scrollBy({ top: this.scrollTop * -1, behavior: "auto" });
//             if (this.parentElement) {
//                 this.parentElement.scrollBy({
//                     top: e.deltaY + oldScrollTop,
//                     behavior: "auto",
//                 });
//             }
//         }
//     };
// }
