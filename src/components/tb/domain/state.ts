import { Cols } from "./cols/cols.js";
import { Foots } from "./foots/foots.js";
import { Api as CtxMenuApi } from "../../ctx-menu/domain/props.js";
import { Props } from "./props.js";
import { Accessor, createSignal } from "solid-js";
import { SortedBy } from "./sorted-by.js";
import { Col } from "./cols/col.js";

export class State<S = any> {
    cols: Cols<S>;
    foots: Foots;
    ctxMenu = {} as CtxMenuApi<Col<S>>;
    sorted?: {
        by: Accessor<SortedBy<S> | undefined>;
        setBy: (val: SortedBy<S> | undefined) => void;
    };
    dfltSort?: SortedBy<S>;
    tbWrapper!: HTMLDivElement;
    tb!: HTMLTableElement;
    verticalScrollbar!: HTMLDivElement;
    verticalScrollbarArrowUp!: HTMLButtonElement;
    verticalScrollbarArrowDown!: HTMLButtonElement;
    verticalThumbWrapper!: HTMLDivElement;
    verticalThumb!: HTMLButtonElement;

    constructor(props: Props<S>) {
        this.cols = new Cols(props);
        this.foots = new Foots(props, this.cols.leafs, this.cols.orderedLeafs);
        if (props.onSort) {
            const [by, setBy] = createSignal<SortedBy<S> | undefined>(undefined);
            this.sorted = {
                by,
                setBy: function (val: SortedBy<S> | undefined) {
                    props.onSort?.(val);
                    setBy(val);
                },
            };
            this.dfltSort = props.dfltSort;
        }
    }

    computeTbWrapperAndTbWidthDiff(): number {
        return (
            parseFloat(getComputedStyle(this.tbWrapper).width) -
            parseFloat(getComputedStyle(this.tb).width)
        );
    }
}
