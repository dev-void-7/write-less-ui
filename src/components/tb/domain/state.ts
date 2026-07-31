import { Cols } from "./cols/cols.js";
import { Foots } from "./foots/foots.js";
import { Api as CtxMenuApi } from "../../ctx-menu/domain/props.js";
import { Props } from "./props.js";
import { Accessor, createSignal } from "solid-js";
import { SortedBy } from "./sorted-by.js";
import { Col } from "./cols/col.js";
import { Elems } from "./elems.js";
import { VerticalScrolling } from "./scrolling/vertical.js";

export class State<S = any> {
    cols: Cols<S>;
    foots: Foots;
    ctxMenu = {} as CtxMenuApi<Col<S>>;
    sorted?: {
        by: Accessor<SortedBy<S> | undefined>;
        setBy: (val: SortedBy<S> | undefined) => void;
    };
    elems: Elems = new Elems();
    verticalScrolling = new VerticalScrolling(this.elems);

    constructor(props: Props<S>) {
        this.cols = new Cols(props);
        this.foots = new Foots(props, this.cols.leafs, this.cols.orderedLeafs);
        if (props.onSort) {
            const [by, setBy] = createSignal<SortedBy<S> | undefined>(props.dfltSort);
            this.sorted = {
                by,
                setBy: function (val: SortedBy<S> | undefined) {
                    props.onSort?.(val);
                    setBy(val);
                },
            };
        }
    }

    distributeFreeSpaceToLeafsWithNoWidth() {
        const freeSpace = this.elems.tbWrapperAndTbWidthDiff();
        this.cols.distributeFreeSpaceToLeafsWithNoWidth(freeSpace);
    }

    observeTbWrapperLayoutAndOverflow() {
        this.elems.observeTbWrapperLayoutAndOverflow();
    }

    initScrolling() {
        this.verticalScrolling.init();
    }
}
