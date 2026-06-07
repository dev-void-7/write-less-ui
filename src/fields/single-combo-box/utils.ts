import { Accessor, Setter } from "solid-js";
import { Merged, Opt, Status } from "./types.js";
import { FormState } from "../../form/state.js";
import { MsgState } from "../../msg/types.js";
import { makeArrowUpDownNavigateOpts } from "../common/utils/make-arrow-up-down-navigate-dropdown-opts.js";


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

export function getFns<T, V, I>(
    merged: Merged<T, V, I>,
    opts: Accessor<Array<Opt<V, I>>>,
    setOpts: Setter<Array<Opt<V, I>>>,
    setStatus: Setter<Status>,
    setSelectedOpt: Setter<Opt<V, I> | undefined>,
    dropdown: HTMLDivElement,
    input: HTMLInputElement,
) {
    let page = 1;
    let count = 0;

    async function handleComboBoxClick(
        e: MouseEvent & {
            currentTarget: HTMLButtonElement;
            target: Element;
        },
    ) {
        if (dropdown.matches(":popover-open") == true) return;
        await loadOptsAndReset();
    }

    async function handleOptsContainerScrollEnd(
        e: Event & {
            currentTarget: HTMLDivElement;
            target: Element;
        },
    ) {
        if (page * merged.perPage >= count) return;
        const optsContainer = e.currentTarget;
        const totalContentHeight = optsContainer.scrollHeight;
        const scrolledFromTop = optsContainer.scrollTop;
        const visibleContainerHeight = optsContainer.clientHeight;

        // Check if internal scroll reached the bottom boundary
        if (
            Math.ceil(scrolledFromTop + visibleContainerHeight) + 8 <
            totalContentHeight
        ) {
            return;
        }

        page++;
        try {
            const result = await loadOpts();
            setOpts([...opts(), ...result]);
        } catch (_) {}
    }

    async function loadOptsAndReset() {
        page = 1;
        try {
            setStatus(Status.Loading);
            const result = await loadOpts();
            setOpts(result);
        } catch (_) {
            setStatus(Status.Error);
        }
    }

    async function loadOpts(): Promise<Array<Opt<V, I>>> {
        let result: Array<T>;
        [count, result] = await merged.search(
            input.value,
            page,
            merged.perPage,
        );
        const newOpts: Array<Opt<V, I>> = Array.from({
            length: result.length,
        });
        for (let i = 0; i < result.length; i++) {
            newOpts[i] = merged.mapToOpt(result[i]);
        }
        return newOpts;
    }

    function select(e: MouseEvent & { currentTarget: HTMLButtonElement }) {
        if (merged.disabled) return;
        const opt = opts()[Number(e.currentTarget.dataset.idx)];
        setSelectedOpt(opt);
        merged.onValueChange?.(opt.value, opt.item);
        // without `setTimeout` popover won't be hidden in case of `Enter` keydown
        setTimeout(() => dropdown.hidePopover());
    }

    return {
        handleComboBoxClick,
        handleOptsContainerScrollEnd,
        loadOptsAndReset,
        loadOpts,
        select,
	};
}

