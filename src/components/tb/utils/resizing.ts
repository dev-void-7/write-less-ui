import { Col } from "../domain/cols/col.js";

export function generateOnResizerPointerDown(col: Col, tb: HTMLTableElement) {
    return function (this: HTMLButtonElement, ptrDownEvent: PointerEvent) {
        this.classList.add("wl--active");
        const computedTbStyle = getComputedStyle(tb);
        const originX = ptrDownEvent.clientX;
        let resizeBy = 0;
        let finalResizeBy = 0;
        const onPointerMove = (e: PointerEvent) => {
            e.preventDefault();
            resizeBy = (e.clientX - originX) * (computedTbStyle.direction == "rtl" ? -1 : 1);
            if (col.canNotResizeBy(resizeBy)) {
                document.documentElement.style.cursor = "not-allowed";
                return;
            }

            document.documentElement.style.removeProperty("cursor");
            finalResizeBy = resizeBy;
            this.style.insetInlineEnd = `calc(anchor(--th-anchor end) - 5px - ${finalResizeBy}px)`;
        };
        const onPointerUp = () => {
            this.classList.remove("wl--active");
            if (finalResizeBy !== 0) col.resizeBy(finalResizeBy);
            console.log(finalResizeBy);
            document.removeEventListener("pointermove", onPointerMove);
            this.style.removeProperty("inset-inline-end");
            document.documentElement.style.removeProperty("cursor");
        };

        document.addEventListener("pointerup", onPointerUp, { once: true });
        document.addEventListener("pointermove", onPointerMove);
    };
}
