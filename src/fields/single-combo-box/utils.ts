import { Accessor, Setter } from "solid-js";
import { Merged, Opt, Status } from "./types.js";
import { FormState } from "../../form/state.js";
import { MsgState } from "../../msg/types.js";
import { makeArrowUpDownNavigateOpts } from "../common/utils/make-arrow-up-down-navigate-dropdown-opts.js";
import { PromiseManager } from "../../utils/abortable-promise.js";

export function handleOnMount<T, V, I>(
    form: FormState | undefined,
    merged: Merged<T, V, I>,
    button: HTMLButtonElement,
    dropdown: HTMLDivElement,
    opts: HTMLDivElement,
    selectedOpt: Accessor<Opt<V, I> | undefined>,
    msgState: MsgState | undefined,
) {
    form?.registerField({
        getKey: () => merged.key,
        getValue: () => selectedOpt()?.value,
        elem: button,
        msgState: msgState as MsgState,
        validate: () => {
            if (merged.required && selectedOpt() == undefined) {
                (msgState as MsgState).err(merged.requiredCode);
                return false;
            }
            return true;
        },
    });

    makeArrowUpDownNavigateOpts(dropdown, opts);
}

export class State<T, V, I> {
    merged: Merged<T, V, I>;
    promiseManager: PromiseManager;
    popoverOpen = false;
    opts: Accessor<Array<Opt<V, I>>>;
    setOpts: Setter<Array<Opt<V, I>>>;
    setStatus: Setter<Status>;
    setSelectedOpt: Setter<Opt<V, I> | undefined>;
    page = 1;
    count = 0;
    dropdown!: HTMLDivElement;
    button!: HTMLButtonElement;
    searchInput!: HTMLInputElement;
    optsStatusContainer!: HTMLDivElement;
    optsElem!: HTMLDivElement;

    constructor(
        merged: Merged<T, V, I>,
        opts: Accessor<Array<Opt<V, I>>>,
        setOpts: Setter<Array<Opt<V, I>>>,
        setStatus: Setter<Status>,
        setSelectedOpt: Setter<Opt<V, I> | undefined>,
    ) {
        this.merged = merged;
        this.promiseManager = new PromiseManager();
        this.opts = opts;
        this.setOpts = setOpts;
        this.setStatus = setStatus;
        this.setSelectedOpt = setSelectedOpt;
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
            this.handleOptsStatusContainerScroll,
        );
    }

    async handleOptsStatusContainerScroll() {
        if (this.page * this.merged.perPage >= this.count) {
            this.optsStatusContainer.removeEventListener(
                "scroll",
                this.handleOptsStatusContainerScroll,
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
            const result = await this.loadOpts();
            this.setOpts([...this.opts(), ...result]);
        } catch (e) {
            if (e !== undefined) this.setStatus(Status.Error);
        }
    }

    async loadOptsAndReset() {
        this.page = 1;
        this.setOpts([]);
        try {
            const result = await this.loadOpts();
            this.setOpts(result);
        } catch (e) {
            if (e !== undefined) this.setStatus(Status.Error);
        }
    }

    async loadOpts(): Promise<Array<Opt<V, I>>> {
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
        this.merged.onValueChange?.(opt.value, opt.item);
        // without `setTimeout` popover won't be hidden in case of `Enter` keydown
        setTimeout(() => this.dropdown.hidePopover());
    }

    deselect(e: MouseEvent) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
        this.setSelectedOpt(undefined);
    }

    async checkPopoverStatus(e: ToggleEvent) {
        this.popoverOpen = e.newState == "open";

        if (!this.popoverOpen) {
            this.promiseManager.abort();
        }
    }
}
