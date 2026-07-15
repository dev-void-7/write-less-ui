import { Col } from "../domain/cols/col.js";

export function generateOnResizerMouseDown(col: Col) {
    return function (this: HTMLButtonElement, mouseDownEvent: MouseEvent) {
        this.classList.add("wl--active");

        const originX = mouseDownEvent.clientX;
        const onMouseMove = (e: MouseEvent) => {
            e.preventDefault();
            this.style.insetInlineEnd = `calc(anchor(--th-anchor end) + ${originX - e.clientX}px)`;
        };
        const onMouseUp = (e: MouseEvent) => {
            this.classList.remove("wl--active");
            const offset = e.clientX - originX;
            col.resizeBy(offset);
            document.removeEventListener("mousemove", onMouseMove);
            this.style.insetInlineEnd = `calc(anchor(--th-anchor end) - 1.5px)`;
        };

        document.addEventListener("mouseup", onMouseUp, { once: true });
        document.addEventListener("mousemove", onMouseMove);
    };
}
