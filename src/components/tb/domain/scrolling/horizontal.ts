import { Elems } from "../elems.js";

export class HorizontalScrolling {
    elems: Elems;
    arrowUpInterval?: number;
    arrowDownInterval?: number;
    thumbInterval?: number;

    constructor(elems: Elems) {
        this.elems = elems;
    }

    init() {
        const elems = this.elems;
        const onArrowUpPointerDown = () => this.onArrowUpPointerDown();
        const onArrowDownPointerDown = () => this.onArrowDownPointerDown();
        const onThumbWrapperPointerDown = (e: PointerEvent) => this.onThumbWrapperPointerDown(e);
        const onThumbPointerDown = (e: PointerEvent) => this.onThumbPointerDown(e);
        const clearArrowUpInterval = () => this.clearArrowUpInterval();
        const clearArrowDownInterval = () => this.clearArrowDownInterval();
        const clearThumbInterval = () => this.clearThumbInterval();
        const onThumbWrapperWheel = (e: WheelEvent) => this.onThumbWrapperWheel(e);
        const onTbWrapperScroll = () => this.onTbWrapperScroll();
        elems.horizontalScrollbarArrowUp.addEventListener("pointerdown", onArrowUpPointerDown);
        elems.horizontalScrollbarArrowDown.addEventListener("pointerdown", onArrowDownPointerDown);
        elems.horizontalThumbWrapper.addEventListener("pointerdown", onThumbWrapperPointerDown);
        elems.horizontalThumb.addEventListener("pointerdown", onThumbPointerDown);
        elems.horizontalScrollbarArrowUp.addEventListener("pointerup", clearArrowUpInterval);
        elems.horizontalScrollbarArrowDown.addEventListener("pointerup", clearArrowDownInterval);
        elems.horizontalThumbWrapper.addEventListener("pointerup", clearThumbInterval);
        elems.horizontalScrollbarArrowUp.addEventListener("pointerleave", clearArrowUpInterval);
        elems.horizontalScrollbarArrowDown.addEventListener("pointerleave", clearArrowDownInterval);
        elems.horizontalThumbWrapper.addEventListener("pointerleave", clearThumbInterval);
        elems.horizontalThumbWrapper.addEventListener("wheel", onThumbWrapperWheel);
        elems.tbWrapper.addEventListener("scroll", onTbWrapperScroll);
    }

    onThumbWrapperWheel(e: WheelEvent) {
        e.preventDefault();
        const behavior = e.deltaX > 37 || e.deltaX < -37 ? "smooth" : "instant";
        this.elems.tbWrapper.scrollBy({
            left: e.deltaX,
            behavior,
        });
    }

    onTbWrapperScroll() {
        const elems = this.elems;
        elems.horizontalThumb.style.transform = `translateX(calc(${
            (elems.tbWrapper.scrollLeft / elems.tbWrapperOverflowingWidth) *
            (elems.horizontalThumbWrapperWidth - elems.horizontalThumbWidth)
        }px * var(--dir-factor)))`;
    }

    onArrowUpPointerDown() {
        this.scrollTbWrapper(-45);
        this.clearArrowUpInterval();
        this.arrowUpInterval = setInterval(() => {
            this.scrollTbWrapper(-45);
        }, 50);
    }

    onArrowDownPointerDown() {
        this.scrollTbWrapper(45);
        this.clearArrowDownInterval();
        this.arrowDownInterval = setInterval(() => {
            this.scrollTbWrapper(45);
        }, 50);
    }

    onThumbWrapperPointerDown = (e: PointerEvent) => {
        this.scrollTBWrapperByPage(e);
        this.clearThumbInterval();
        this.thumbInterval = setInterval(() => {
            this.scrollTBWrapperByPage(e);
        }, 50);
    };

    onThumbPointerDown(pointerDownEvent: PointerEvent) {
        const elems = this.elems;
        pointerDownEvent.preventDefault();
        pointerDownEvent.stopPropagation();
        let prePoint = pointerDownEvent.clientX;
        const onPointerMove = (pointerMoveEvent: PointerEvent) => {
            const percent =
                (prePoint - pointerMoveEvent.clientX) /
                (elems.horizontalThumbWrapperWidth - elems.horizontalThumbWidth);
            prePoint = pointerMoveEvent.clientX;
            elems.tbWrapper.scrollBy({
                left: (elems.tbWrapperWidth - elems.tbWidth) * percent,
                behavior: "instant",
            });
        };
        document.addEventListener("pointermove", onPointerMove);
        document.addEventListener(
            "pointerup",
            () => {
                document.removeEventListener("pointermove", onPointerMove);
            },
            { once: true },
        );
    }

    clearArrowUpInterval() {
        clearInterval(this.arrowUpInterval);
    }
    clearArrowDownInterval() {
        clearInterval(this.arrowDownInterval);
    }
    clearThumbInterval() {
        clearInterval(this.thumbInterval);
    }

    scrollTBWrapperByPage(e: PointerEvent) {
        const thumbRect = this.elems.horizontalThumb.getBoundingClientRect();
        if (
            e.clientX >= thumbRect.left &&
            e.clientX <= thumbRect.right &&
            e.clientY >= thumbRect.top &&
            e.clientY <= thumbRect.bottom
        ) {
            return;
        }
        const pageJump = this.elems.tbWrapper.clientWidth - 20;

        if (e.clientX < thumbRect.left) {
            this.scrollTbWrapper(-pageJump);
        } else {
            this.scrollTbWrapper(pageJump);
        }
    }

    scrollTbWrapper(left: number) {
        this.elems.tbWrapper.scrollBy({
            left,
            behavior: "smooth",
        });
    }
}
