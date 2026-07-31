import { Elems } from "../elems.js";

export class VerticalScrolling {
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
        elems.verticalScrollbarArrowUp.addEventListener("pointerdown", onArrowUpPointerDown);
        elems.verticalScrollbarArrowDown.addEventListener("pointerdown", onArrowDownPointerDown);
        elems.verticalThumbWrapper.addEventListener("pointerdown", onThumbWrapperPointerDown);
        elems.verticalThumb.addEventListener("pointerdown", onThumbPointerDown);
        elems.verticalScrollbarArrowUp.addEventListener("pointerup", clearArrowUpInterval);
        elems.verticalScrollbarArrowDown.addEventListener("pointerup", clearArrowDownInterval);
        elems.verticalThumbWrapper.addEventListener("pointerup", clearThumbInterval);
        elems.verticalScrollbarArrowUp.addEventListener("pointerleave", clearArrowUpInterval);
        elems.verticalScrollbarArrowDown.addEventListener("pointerleave", clearArrowDownInterval);
        elems.verticalThumbWrapper.addEventListener("pointerleave", clearThumbInterval);
        elems.verticalThumbWrapper.addEventListener("wheel", onThumbWrapperWheel);
        elems.tbWrapper.addEventListener("scroll", onTbWrapperScroll);
    }

    onThumbWrapperWheel(e: WheelEvent) {
        e.preventDefault();
        const behavior = e.deltaY > 37 || e.deltaY < -37 ? "smooth" : "instant";
        this.elems.tbWrapper.scrollBy({
            top: e.deltaY,
            behavior,
        });
    }

    onTbWrapperScroll() {
        const elems = this.elems;
        elems.verticalThumb.style.transform = `translateY(${
            (elems.tbWrapper.scrollTop / elems.tbWrapperOverflowingHeight) *
            (elems.verticalThumbWrapperHeight - elems.verticalThumbHeight)
        }px)`;
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
        let prePoint = pointerDownEvent.clientY;
        const onPointerMove = (pointerMoveEvent: PointerEvent) => {
            const percent =
                (prePoint - pointerMoveEvent.clientY) /
                (elems.verticalThumbWrapperHeight - elems.verticalThumbHeight);
            prePoint = pointerMoveEvent.clientY;
            elems.tbWrapper.scrollBy({
                top: (elems.tbWrapperHeight - elems.tbHeight) * percent,
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
        const thumbRect = this.elems.verticalThumb.getBoundingClientRect();
        if (
            e.clientX >= thumbRect.left &&
            e.clientX <= thumbRect.right &&
            e.clientY >= thumbRect.top &&
            e.clientY <= thumbRect.bottom
        ) {
            return;
        }
        const pageJump = this.elems.tbWrapper.clientHeight - 20;

        if (e.clientY < thumbRect.top) {
            this.scrollTbWrapper(-pageJump);
        } else {
            this.scrollTbWrapper(pageJump);
        }
    }

    scrollTbWrapper(top: number) {
        this.elems.tbWrapper.scrollBy({
            top,
            behavior: "smooth",
        });
    }
}
