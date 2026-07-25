export function initVerticalScrolling(
    tbWrapper: HTMLDivElement,
    tb: HTMLTableElement,
    verticalScrollbar: HTMLDivElement,
    verticalScrollbarArrowUp: HTMLButtonElement,
    verticalScrollbarArrowDown: HTMLButtonElement,
    thumbWrapper: HTMLDivElement,
    thumb: HTMLButtonElement,
) {
    new VerticalScrolling(
        tbWrapper,
        tb,
        verticalScrollbar,
        verticalScrollbarArrowUp,
        thumbWrapper,
        thumb,
        verticalScrollbarArrowDown,
    );
}

class VerticalScrolling {
    tbWrapper: HTMLDivElement;
    tb: HTMLTableElement;
    scrollbar: HTMLDivElement;
    scrollbarArrowUp: HTMLButtonElement;
    thumbWrapper: HTMLDivElement;
    thumb: HTMLButtonElement;
    scrollbarArrowDown: HTMLButtonElement;
    tbWrapperHeight: number;
    tbHeight: number;
    tbWrapperOverflowingHeight: number;
    thumbWrapperHeight: number;
    thumbHeight: number;
    thumbTranslateY: number = 0;
    onThumbWrapperWheel: (e: WheelEvent) => void;
    onTbWrapperScroll: (e: Event) => void;
    observer: ResizeObserver;
    arrowUpInterval?: number;
    arrowDownInterval?: number;
    thumbInterval?: number;
    clearArrowUpInterval = () => clearInterval(this.arrowUpInterval);
    clearArrowDownInterval = () => clearInterval(this.arrowDownInterval);
    clearThumbInterval = () => clearInterval(this.thumbInterval);
    onArrowUpPointerDown = () => {
        this.scrollTbWrapper(-45);
        this.clearArrowUpInterval();
        this.arrowUpInterval = setInterval(() => {
            this.scrollTbWrapper(-45);
        }, 50);
    };
    onArrowDownPointerDown = () => {
        this.scrollTbWrapper(45);
        this.clearArrowDownInterval();
        this.arrowDownInterval = setInterval(() => {
            this.scrollTbWrapper(45);
        }, 50);
    };
    onThumbWrapperPointerDown = (e: PointerEvent) => {
        this.scrollTBWrapperByPage(e);
        this.clearThumbInterval();
        this.thumbInterval = setInterval(() => {
            this.scrollTBWrapperByPage(e);
        }, 50);
    };
    onThumbPointerDown = (pointerDownEvent: PointerEvent) => {
        pointerDownEvent.preventDefault();
        pointerDownEvent.stopPropagation();
        let thumbTranslateYAtStart = this.thumbTranslateY;
        const onPointerMove = (pointerMoveEvent: PointerEvent) => {
            const percent =
                (thumbTranslateYAtStart + (pointerMoveEvent.clientY - pointerDownEvent.clientY)) /
                (this.thumbWrapperHeight - this.thumbHeight);
            console.log((this.tbWrapperHeight - this.tbHeight) * -percent);
            this.tbWrapper.scrollTop = (this.tbWrapperHeight - this.tbHeight) * -percent;
        };
        document.addEventListener("pointermove", onPointerMove);
        document.addEventListener(
            "pointerup",
            () => {
                document.removeEventListener("pointermove", onPointerMove);
            },
            { once: true },
        );
    };

    constructor(
        tbWrapper: HTMLDivElement,
        tb: HTMLTableElement,
        scrollbar: HTMLDivElement,
        scrollbarArrowUp: HTMLButtonElement,
        thumbWrapper: HTMLDivElement,
        thumb: HTMLButtonElement,
        scrollbarArrowDown: HTMLButtonElement,
    ) {
        this.tbWrapper = tbWrapper;
        this.tb = tb;
        this.scrollbar = scrollbar;
        this.scrollbarArrowUp = scrollbarArrowUp;
        this.thumbWrapper = thumbWrapper;
        this.thumb = thumb;
        this.scrollbarArrowDown = scrollbarArrowDown;

        this.tbWrapperHeight = parseFloat(getComputedStyle(tbWrapper).height);
        this.tbHeight = parseFloat(getComputedStyle(tb).height);
        this.thumbWrapperHeight = parseFloat(getComputedStyle(thumbWrapper).height);
        this.thumbHeight = this.thumbWrapperHeight * (this.tbWrapperHeight / this.tbHeight);
        this.tbWrapperOverflowingHeight = this.tbHeight - this.tbWrapperHeight;
        thumb.style.height = `${this.thumbHeight}px`;

        this.onThumbWrapperWheel = (e: WheelEvent) => {
            this.handleThumbWrapperWheel(e);
        };
        this.onTbWrapperScroll = (_e: Event) => {
            this.handleTbWrapperScroll();
        };

        this.tbWrapper.addEventListener("scroll", this.onTbWrapperScroll);
        this.observer = this.showScrollbarWhenOverflow();
        this.initScrollbarFunctionality();
    }

    showScrollbarWhenOverflow() {
        const observer = new ResizeObserver(() => {
            if (this.isTbWrapperScrollable()) {
                this.scrollbar.classList.add("wl--show");

                this.tbWrapperHeight = parseFloat(getComputedStyle(this.tbWrapper).height);
                this.tbHeight = parseFloat(getComputedStyle(this.tb).height);
                this.thumbWrapperHeight = parseFloat(getComputedStyle(this.thumbWrapper).height);
                this.thumbHeight = this.thumbWrapperHeight * (this.tbWrapperHeight / this.tbHeight);
                this.tbWrapperOverflowingHeight = this.tbHeight - this.tbWrapperHeight;
                this.thumb.style.height = `${this.thumbHeight}px`;

                this.thumbWrapper.addEventListener("wheel", this.onThumbWrapperWheel, {
                    passive: false,
                });
            } else {
                this.scrollbar.classList.remove("wl--show");
                this.thumbWrapper.removeEventListener("wheel", this.onThumbWrapperWheel);
            }
        });

        observer.observe(this.tbWrapper);
        observer.observe(this.tb);

        return observer;
    }

    isTbWrapperScrollable() {
        if (this.tbWrapper.scrollTop > 0) return true;
        this.tbWrapper.scrollTop = 1;
        const scrolls = this.tbWrapper.scrollTop > 0;
        this.tbWrapper.scrollTop = 0; // Reset immediately
        return scrolls;
    }

    handleTbWrapperScroll() {
        const percent = this.tbWrapper.scrollTop / this.tbWrapperOverflowingHeight;
        this.thumbTranslateY = (this.thumbWrapperHeight - this.thumbHeight) * percent;
        this.thumb.style.transform = `translateY(${this.thumbTranslateY}px)`;
    }

    handleThumbWrapperWheel(e: WheelEvent) {
        e.preventDefault();
        this.tbWrapper.scrollTop += e.deltaY;
    }

    initScrollbarFunctionality() {
        this.scrollbarArrowUp.addEventListener("pointerdown", this.onArrowUpPointerDown);
        this.scrollbarArrowDown.addEventListener("pointerdown", this.onArrowDownPointerDown);
        this.thumbWrapper.addEventListener("pointerdown", this.onThumbWrapperPointerDown);
        this.thumb.addEventListener("pointerdown", this.onThumbPointerDown);

        this.scrollbarArrowUp.addEventListener("pointerup", this.clearArrowUpInterval);
        this.scrollbarArrowDown.addEventListener("pointerup", this.clearArrowDownInterval);
        this.thumbWrapper.addEventListener("pointerup", this.clearThumbInterval);

        this.scrollbarArrowUp.addEventListener("pointerleave", this.clearArrowUpInterval);
        this.scrollbarArrowDown.addEventListener("pointerleave", this.clearArrowDownInterval);
        this.thumbWrapper.addEventListener("pointerleave", this.clearThumbInterval);
    }

    scrollTbWrapper(top: number) {
        this.tbWrapper.scrollBy({
            top,
            behavior: "smooth",
        });
    }

    scrollTBWrapperByPage(e: PointerEvent) {
        const thumbRect = this.thumb.getBoundingClientRect();
        if (
            e.clientX >= thumbRect.left &&
            e.clientX <= thumbRect.right &&
            e.clientY >= thumbRect.top &&
            e.clientY <= thumbRect.bottom
        ) {
            return;
        }
        const pageJump = this.tbWrapper.clientHeight - 20;

        if (e.clientY < thumbRect.top) {
            this.scrollTbWrapper(-pageJump);
        } else {
            this.scrollTbWrapper(pageJump);
        }
    }

    destroy() {
        this.tbWrapper.removeEventListener("scroll", this.onTbWrapperScroll);
        this.thumbWrapper.removeEventListener("wheel", this.onThumbWrapperWheel);
        this.observer.disconnect();
    }
}
