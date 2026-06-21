import { Accessor, createSignal, createUniqueId, Setter } from "solid-js";
import { PromiseManager } from "../../utils/promise-manager.js";
import { Merged, Opt, Status } from "./types.js";

export class State<T, V, I> {
    merged: Merged<T, V, I>;
    promiseManager: PromiseManager;
    popoverOpen = false;
    opts: Accessor<Array<Opt<V, I>>>;
    setOpts: Setter<Array<Opt<V, I>>>;
	status: Accessor<Status>;
    setStatus: Setter<Status>;
	selectedOpt: Accessor<Opt<V, I> | undefined>;
    setSelectedOpt: Setter<Opt<V, I> | undefined>;
	selectedOptLabel = () => {
        const sOpt = this.selectedOpt();
        return sOpt ? sOpt.selectionLabel?.() || sOpt.optLabel("") : undefined;
    };
	dropdownId: string;
    page = 1;
    count = 0;
    dropdown!: HTMLDivElement;
    button!: HTMLButtonElement;
    searchInput!: HTMLInputElement;
    optsStatusContainer!: HTMLDivElement;
    optsElem!: HTMLDivElement;

    constructor(
        merged: Merged<T, V, I>,
    ) {
        this.merged = merged;
        this.promiseManager = new PromiseManager();
        [this.opts, this.setOpts] = createSignal<Array<Opt<V, I>>>([]);
        [this.status, this.setStatus] = createSignal<Status>(Status.Idle);
        [this.selectedOpt, this.setSelectedOpt] = createSignal<Opt<V, I> | undefined>(undefined);
		this.dropdownId = createUniqueId();
    }

    bindAndGetPubFns() {
        return {
            handleComboBoxClick: this.handleComboBoxClick.bind(this),
            loadOptsAndReset: this.loadOptsAndReset.bind(this),
            select: this.select.bind(this),
            deselect: this.deselect.bind(this),
            checkPopoverStatus: this.checkPopoverStatus.bind(this),
        };
    }

    async handleComboBoxClick(
        e: MouseEvent & {
            currentTarget: HTMLButtonElement;
            target: Element;
        },
    ) {
        // here checking is done on the pre value becuase `handleCombBoxClick` is called before `checkPopoverStatus`
        if (this.popoverOpen) return;
        setTimeout(() => {
            this.searchInput.focus();
        });
        await this.loadOptsAndReset();
        this.optsStatusContainer.addEventListener(
            "scroll",
            this.#handleOptsStatusContainerScroll,
        );
    }

    async #handleOptsStatusContainerScroll() {
        if (this.page * this.merged.perPage >= this.count) {
            this.optsStatusContainer.removeEventListener(
                "scroll",
                this.#handleOptsStatusContainerScroll,
            );
        }

        const {
            scrollHeight: totalContentHeight,
            scrollTop: scrolledFromTop,
            clientHeight: visibleContainerHeight,
        } = this.optsStatusContainer;

        // Check if internal scroll reached the bottom boundary
        if (
            Math.ceil(scrolledFromTop + visibleContainerHeight) + 8 <
            totalContentHeight
        )
            return;

        this.page++;
        try {
            const result = await this.#loadOpts();
            this.setOpts([...this.opts(), ...result]);
        } catch (e) {
            if (e !== undefined) this.setStatus(Status.Error);
        }
    }

    async loadOptsAndReset() {
        this.page = 1;
        this.setOpts([]);
        try {
            const result = await this.#loadOpts();
            this.setOpts(result);
        } catch (e) {
            if (e !== undefined) this.setStatus(Status.Error);
        }
    }

    async #loadOpts(): Promise<Array<Opt<V, I>>> {
        this.setStatus(Status.Loading);
        this.promiseManager.abort();
        let result: Array<T>;
        [this.count, result] = await this.promiseManager.run(
            this.merged.search(
                this.searchInput.value,
                this.page,
                this.merged.perPage,
            ),
        );
        const newOpts: Array<Opt<V, I>> = Array.from({
            length: result.length,
        });
        for (let i = 0; i < result.length; i++) {
            newOpts[i] = this.merged.mapToOpt(result[i]);
        }
        this.setStatus(Status.Idle);
        return newOpts;
    }

    select(e: MouseEvent & { currentTarget: HTMLButtonElement }) {
        if (this.merged.disabled) return;
        const opt = this.opts()[Number(e.currentTarget.dataset.idx)];
        this.setSelectedOpt(opt);
        this.merged.onValueChange?.(opt);
        // without `setTimeout` popover won't be hidden in case of `Enter` keydown
        setTimeout(() => this.dropdown.hidePopover());
    }

    deselect(e: MouseEvent) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
        this.setSelectedOpt(undefined);
		this.merged.onValueChange?.();
    }

    async checkPopoverStatus(e: ToggleEvent) {
        this.popoverOpen = e.newState == "open";

        if (!this.popoverOpen) {
            this.promiseManager.abort();
        }
    }
}
