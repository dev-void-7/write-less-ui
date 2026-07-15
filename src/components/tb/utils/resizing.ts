import { Col } from "../domain/cols/col.js";

export function generateOnResizerPointerDown(col: Col) {
    return function (this: HTMLButtonElement, ptrDownEvent: PointerEvent) {
        this.classList.add("wl--active");

        const originX = ptrDownEvent.clientX;
        const resizerHalfWidth = this.offsetWidth / 2;
        let resizeBy = 0;
        const onPointerMove = (e: PointerEvent) => {
            e.preventDefault();
            if (col.canNotResizeBy(e.clientX - resizerHalfWidth - originX)) return;
            resizeBy = e.clientX - resizerHalfWidth - originX;
            this.style.insetInlineStart = `${e.clientX - resizerHalfWidth}px`;
            this.style.insetInlineEnd = `unset`;
        };
        const onPointerUp = () => {
            this.classList.remove("wl--active");
            if (resizeBy !== 0) col.resizeBy(resizeBy);
            document.removeEventListener("pointermove", onPointerMove);
            this.style.removeProperty("inset-inline-end");
            this.style.removeProperty("inset-inline-start");
        };

        document.addEventListener("pointerup", onPointerUp, { once: true });
        document.addEventListener("pointermove", onPointerMove);
    };
}
