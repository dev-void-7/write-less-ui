import { Col } from "../domain/cols/col.js";

export function generateOnResizerPointerDown(col: Col) {
    return function (this: HTMLButtonElement, ptrDownEvent: PointerEvent) {
        this.classList.add("wl--active");

        const originX = ptrDownEvent.clientX;
        let resizeBy = 0;
        const onPointerMove = (e: PointerEvent) => {
            e.preventDefault();
            if (col.canNotResizeBy(e.clientX - originX)) {
                document.documentElement.style.cursor = "not-allowed";
                return;
            }
            document.documentElement.style.removeProperty("cursor");
            resizeBy = e.clientX - originX;
            this.style.insetInlineEnd = `calc(anchor(--th-anchor end) - 5px - ${resizeBy}px)`;
        };
        const onPointerUp = () => {
            this.classList.remove("wl--active");
            if (resizeBy !== 0) col.resizeBy(resizeBy);
            console.log(resizeBy);
            document.removeEventListener("pointermove", onPointerMove);
            this.style.removeProperty("inset-inline-end");
            document.documentElement.style.removeProperty("cursor");
        };

        document.addEventListener("pointerup", onPointerUp, { once: true });
        document.addEventListener("pointermove", onPointerMove);
    };
}
