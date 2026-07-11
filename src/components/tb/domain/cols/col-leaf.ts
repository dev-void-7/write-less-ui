import { Accessor, createSignal, Setter } from "solid-js";

export class ColLeaf {
    idx: number;
    label: () => string;
    rowSpan?: number;
    width: Accessor<string>;
    setWidth: Setter<string>;
    sortable: boolean;
    hideOnExport: boolean;
    hideOnPrint: boolean;
    unhideable: boolean;
    type: Type;
    hidden: Accessor<boolean>;
    #setHidden: Setter<boolean>;
    colSpan: Accessor<undefined> = () => undefined;
    visuallyFirstInRow: boolean;

    constructor(idx: number, arg: ColLeafArg, visuallyFirstInRow: boolean) {
        this.idx = idx;
        this.label = arg.label;
        this.rowSpan = arg.rowSpan;
        [this.width, this.setWidth] = createSignal(arg.width || "auto");
        this.sortable = arg.sortable || false;
        this.hideOnExport = arg.hideOnExport || false;
        this.hideOnPrint = arg.hideOnPrint || false;
        this.unhideable = arg.unhideable || false;
        this.type = arg.type || Type.Text;
        [this.hidden, this.#setHidden] = createSignal(false);
        this.visuallyFirstInRow = visuallyFirstInRow;
    }

    hide() {
        this.#setHidden(true);
    }

    show() {
        this.#setHidden(false);
    }
}
export type ColLeafArg = {
    label: () => string;
    rowSpan?: number;
    width?: string;
    sortable?: boolean;
    hideOnExport?: boolean;
    hideOnPrint?: boolean;
    unhideable?: boolean;
    type?: Type;
    children?: never;
};

export const enum Type {
    Numeric,
    Text,
    DateTime,
    Boolean,
}
