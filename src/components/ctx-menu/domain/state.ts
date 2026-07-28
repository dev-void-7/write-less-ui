import { Accessor, createSignal, Setter } from "solid-js";

export class State<T> {
    popover!: HTMLDivElement;
    data: Accessor<T>;
    setData: Setter<T>;
    anchorName: Accessor<string | undefined>;
    setAnchorName: Setter<string | undefined>;
    open: boolean = false;
    onHide: (() => void) | undefined;

    constructor() {
        [this.data, this.setData] = createSignal<T>(undefined as T);
        [this.anchorName, this.setAnchorName] = createSignal<string | undefined>();
    }

    showPopover(data: T, anchorName: string, onHide?: () => void) {
        if (this.open) {
            this.popover.hidePopover();
        }
        setTimeout(() => {
            // @ts-ignore
            this.setData(data);
            this.setAnchorName(anchorName);
            this.onHide = onHide;
            this.popover.showPopover();
        });
    }

    hidePopover() {
        this.popover.hidePopover();
    }

    isPopoverOpen() {
        return this.open;
    }

    addToggleListenerToPopover() {
        this.popover.addEventListener("toggle", (e) => {
            if (e.newState == "closed") {
                this.onHide?.();
                this.open = false;
            } else {
                this.open = true;
            }
        });
    }
}
