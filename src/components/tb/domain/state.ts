import { Cols } from "./cols/cols.js";
import { Foots } from "./foots/foots.js";
import { Api as CtxMenuApi } from "../../ctx-menu/domain/props.js";
import { Col } from "./cols/col.js";
import { Props } from "./props.js";

export class State {
    cols: Cols;
    foots: Foots;
    ctxMenu = {} as CtxMenuApi<Col>;
    tbWrapper!: HTMLDivElement;
    tb!: HTMLTableElement;
    verticalScrollbar!: HTMLDivElement;
    verticalScrollbarArrowUp!: HTMLButtonElement;
    verticalScrollbarArrowDown!: HTMLButtonElement;
    verticalThumbWrapper!: HTMLDivElement;
    verticalThumb!: HTMLButtonElement;

    constructor(props: Props) {
        this.cols = new Cols(props);
        this.foots = new Foots(props, this.cols.leafs, this.cols.orderedLeafs);
    }

    computeTbWrapperAndTbWidthDiff(): number {
        return (
            parseFloat(getComputedStyle(this.tbWrapper).width) -
            parseFloat(getComputedStyle(this.tb).width)
        );
    }
}
