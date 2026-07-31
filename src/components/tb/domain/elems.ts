export class Elems {
    tbWrapper!: HTMLDivElement;
    tb!: HTMLTableElement;
    verticalScrollbar!: HTMLDivElement;
    verticalScrollbarArrowUp!: HTMLButtonElement;
    verticalScrollbarArrowDown!: HTMLButtonElement;
    verticalThumbWrapper!: HTMLDivElement;
    verticalThumb!: HTMLButtonElement;
    horizontalScrollbar!: HTMLDivElement;
    horizontalScrollbarArrowUp!: HTMLButtonElement;
    horizontalScrollbarArrowDown!: HTMLButtonElement;
    horizontalThumbWrapper!: HTMLDivElement;
    horizontalThumb!: HTMLButtonElement;
    tbWrapperHeight: number = 0;
    tbHeight: number = 0;
    tbWrapperOverflowingHeight: number = 0;
    verticalThumbWrapperHeight: number = 0;
    verticalThumbHeight: number = 0;
    tbWrapperWidth: number = 0;
    tbWidth: number = 0;
    tbWrapperOverflowingWidth: number = 0;
    horizontalThumbWrapperWidth: number = 0;
    horizontalThumbWidth: number = 0;
    resizeObserver?: ResizeObserver;

    constructor() {}

    observeTbWrapperLayoutAndOverflow() {
        if (this.resizeObserver) this.resizeObserver.disconnect();
        this.resizeObserver = new ResizeObserver(() => {
            const verticalScrollable = this.isTbWrapperVerticallyScrollable();
            const horizontalScrollable = this.isTbWrapperHorizontallyScrollable();

            if (verticalScrollable) {
                this.verticalScrollbar.classList.remove("wl--hidden");
            } else {
                this.verticalScrollbar.classList.add("wl--hidden");
            }

            if (horizontalScrollable) {
                this.horizontalScrollbar.classList.remove("wl--hidden");
            } else {
                this.horizontalScrollbar.classList.add("wl--hidden");
            }

            this.computeHeightsAndWidths();
        });
        this.resizeObserver.observe(this.tbWrapper);
        this.resizeObserver.observe(this.tb);
    }

    isTbWrapperVerticallyScrollable() {
        if (this.tbWrapper.scrollTop > 0) return true;
        this.tbWrapper.scrollTop = 1;
        const scrolls = this.tbWrapper.scrollTop > 0;
        this.tbWrapper.scrollTop = 0; // Reset immediately
        return scrolls;
    }

    isTbWrapperHorizontallyScrollable() {
        if (this.tbWrapper.scrollLeft > 0) return true;
        this.tbWrapper.scrollLeft = 1;
        const scrolls = this.tbWrapper.scrollLeft > 0;
        this.tbWrapper.scrollLeft = 0; // Reset immediately
        return scrolls;
    }

    computeHeightsAndWidths() {
        const tbWrapperStyle = getComputedStyle(this.tbWrapper),
            tbStyle = getComputedStyle(this.tb),
            verticalThumbWrapperStyle = getComputedStyle(this.verticalThumbWrapper),
            horizontalThumbWrapperStyle = getComputedStyle(this.horizontalThumbWrapper);

        this.tbWrapperHeight = parseFloat(tbWrapperStyle.height);
        this.tbHeight = parseFloat(tbStyle.height);
        this.verticalThumbWrapperHeight = parseFloat(verticalThumbWrapperStyle.height);
        this.verticalThumbHeight =
            this.verticalThumbWrapperHeight * (this.tbWrapperHeight / this.tbHeight);
        this.tbWrapperOverflowingHeight = this.tbHeight - this.tbWrapperHeight;
        this.verticalThumb.style.height = `${this.verticalThumbHeight}px`;

        this.tbWrapperWidth = parseFloat(tbWrapperStyle.width);
        this.tbWidth = parseFloat(tbStyle.width);
        this.horizontalThumbWrapperWidth = parseFloat(horizontalThumbWrapperStyle.width);
        this.horizontalThumbWidth =
            this.horizontalThumbWrapperWidth * (this.tbWrapperWidth / this.tbWidth);
        this.tbWrapperOverflowingWidth = this.tbWidth - this.tbWrapperWidth;
        this.horizontalThumb.style.width = `${this.horizontalThumbWidth}px`;
    }

    tbWrapperAndTbWidthDiff(): number {
        return this.tbWrapperWidth - this.tbWidth;
    }
}
