import { Col } from "../domain/cols/col.js";

export function generateOnResizerPointerDown(col: Col) {
    return function (this: HTMLButtonElement, ptrDownEvent: PointerEvent) {
        this.classList.add("wl--active");

        const originX = ptrDownEvent.clientX;
        const resizerHalfWidth = this.offsetWidth / 2;
        console.log(originX);
        const onPointerMove = (e: PointerEvent) => {
            e.preventDefault();
            this.style.insetInlineStart = `${e.clientX - resizerHalfWidth}px`;
            this.style.insetInlineEnd = `unset`;
        };
        const onPointerUp = (e: PointerEvent) => {
            this.classList.remove("wl--active");
            const offset = e.clientX - originX;
            col.resizeBy(offset);
            document.removeEventListener("pointermove", onPointerMove);
            this.style.removeProperty("inset-inline-end");
            this.style.removeProperty("inset-inline-start");
        };

        document.addEventListener("pointerup", onPointerUp, { once: true });
        document.addEventListener("pointermove", onPointerMove);
    };
}
