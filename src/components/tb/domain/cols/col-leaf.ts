import { Accessor, createSignal, Setter } from "solid-js";

export class ColLeaf {
    id: string;
    idx: number;
    label: () => string;
    rowSpan?: number;
    sortable: boolean;
    hideOnExport: boolean;
    hideOnPrint: boolean;
    unhideable: boolean;
    type: Type;
    hidden: Accessor<boolean>;
    #setHidden: Setter<boolean>;
    baseWidth?: number;
    colSpan: Accessor<undefined> = () => undefined;
    visuallyFirstInRow: boolean;
    width: Accessor<number | undefined>;
    #setWidth: Setter<number | undefined>;
    widthAsLastCol: (remainingWidth: number) => number | undefined;

    constructor(id: string, idx: number, arg: ColLeafArg, visuallyFirstInRow: boolean) {
        this.id = id;
        this.idx = idx;
        this.label = arg.label;
        this.rowSpan = arg.rowSpan;
        this.sortable = arg.sortable || false;
        this.hideOnExport = arg.hideOnExport || false;
        this.hideOnPrint = arg.hideOnPrint || false;
        this.unhideable = arg.unhideable || false;
        this.type = arg.type || Type.Text;
        [this.hidden, this.#setHidden] = createSignal(false);
        this.baseWidth = arg.baseWidth;
        this.visuallyFirstInRow = visuallyFirstInRow;
        const storedWidth = localStorage.getItem(`col-${this.id}-width`);
        let width;
        if (storedWidth) {
            width = Number(storedWidth);
            if (isNaN(width)) width = arg.baseWidth;
        } else {
            width = arg.baseWidth;
        }

        [this.width, this.#setWidth] = createSignal(width);
        this.widthAsLastCol = (remainingWidth: number) => {
            const width = this.width();
            if (!width) return undefined;
            if (remainingWidth > width) return undefined;
            return width;
        };
    }

    hide() {
        this.#setHidden(true);
    }

    show() {
        this.#setHidden(false);
    }

    setWidth(width: number) {
        localStorage.setItem(`col-${this.id}-width`, width.toString());
        this.#setWidth(width);
    }
}

export type ColLeafArg = {
    label: () => string;
    rowSpan?: number;
    baseWidth?: number;
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
