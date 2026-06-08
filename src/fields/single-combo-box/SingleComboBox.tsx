import {
    createSignal,
    createUniqueId,
    For,
    Match,
    mergeProps,
    onMount,
    Show,
    Switch,
} from "solid-js";
import { Opt, Props, Status } from "./types.js";
import { useFormContext } from "../../form/FormContext.jsx";
import { MsgState } from "../../msg/types.js";
import { Msg } from "../../msg/Msg.jsx";
import { Label } from "../common/label/Label.jsx";
import { focusOnMouseEnter } from "../common/utils/make-arrow-up-down-navigate-dropdown-opts.js";
import { CheckIcon } from "../../icons/CheckIcon.jsx";
import { ArrowDownOutlineIcon } from "../../icons/ArrowDownOutlineIcon.jsx";
import { handleOnMount } from "./utils.js";
import { SearchIcon } from "../../icons/SearchIcon.jsx";
import { XCircleOutlineIcon } from "../../icons/XCircleOutlineIcon.jsx";
import { SpinnerLoader } from "../../loaders/spinner.jsx";
import { AbortablePromise } from "../../utils/abortable-promise.js";
import { XIcon } from "../../icons/X.jsx";

export function SingleComboBox<T, V, I>(props: Props<T, V, I>) {
    const merged = mergeProps(props, { id: createUniqueId(), perPage: 20 });
    const form = useFormContext();
    const [opts, setOpts] = createSignal<Array<Opt<V, I>>>([]);
    const [status, setStatus] = createSignal(Status.Idle);
    const [selectedOpt, setSelectedOpt] = createSignal<Opt<V, I> | undefined>();
    const selectedOptLabel = () => {
        const sOpt = selectedOpt();
        return sOpt ? sOpt.selectionLabel?.() || sOpt.optLabel() : undefined;
    };
    const dropdownId = createUniqueId();
    let searchAbortablePromise:
        | AbortablePromise<[count: number, items: Array<T>]>
        | undefined = undefined;
    let msgState = form && new MsgState(form.props.mapCodeToMsg);
    let popoverOpen = false;
    let page = 1;
    let count = 0;
    let dropdown!: HTMLDivElement;
    let button!: HTMLButtonElement;
    let input!: HTMLInputElement;
    let optsStatusContainer!: HTMLDivElement;
    let optsElem!: HTMLDivElement;

    async function handleComboBoxClick(
        e: MouseEvent & {
            currentTarget: HTMLButtonElement;
            target: Element;
        },
    ) {
        // here checking is done on the pre value becuase `handleCombBoxClick` is called before `checkPopoverStatus`
        if (popoverOpen) return;
        setTimeout(() => {
            input.focus();
        });
        await loadOptsAndReset();
        optsStatusContainer.addEventListener(
            "scroll",
            handleOptsStatusContainerScroll,
        );
    }

    async function handleOptsStatusContainerScroll() {
        if (page * merged.perPage >= count) {
            optsStatusContainer.removeEventListener(
                "scroll",
                handleOptsStatusContainerScroll,
            );
        }

        const totalContentHeight = optsStatusContainer.scrollHeight;
        const scrolledFromTop = optsStatusContainer.scrollTop;
        const visibleContainerHeight = optsStatusContainer.clientHeight;

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
        } catch (e) {
            if (e !== undefined) setStatus(Status.Error);
        }
    }

    async function loadOptsAndReset() {
        page = 1;
        setOpts([]);
        try {
            const result = await loadOpts();
            setOpts(result);
        } catch (e) {
            if (e !== undefined) setStatus(Status.Error);
        }
    }

    async function loadOpts(): Promise<Array<Opt<V, I>>> {
        setStatus(Status.Loading);
        await searchAbortablePromise?.abort();
        let result: Array<T>;
        searchAbortablePromise = new AbortablePromise(
            merged.search(input.value, page, merged.perPage),
        );
        [count, result] = await searchAbortablePromise.promise;
        searchAbortablePromise = undefined;
        const newOpts: Array<Opt<V, I>> = Array.from({
            length: result.length,
        });
        for (let i = 0; i < result.length; i++) {
            newOpts[i] = merged.mapToOpt(result[i]);
        }
        setStatus(Status.Idle);
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

	function deselect(e: MouseEvent) {
		e.stopImmediatePropagation();
		e.stopPropagation();
		e.preventDefault();
		setSelectedOpt(undefined);
	}

    async function checkPopoverStatus(e: ToggleEvent) {
        popoverOpen = e.newState == "open";

        if (!popoverOpen) {
            await searchAbortablePromise?.abort();
            searchAbortablePromise = undefined;
        }
    }

    onMount(() => {
        handleOnMount(
            form,
            merged,
            button,
            dropdown,
            optsElem,
            selectedOpt,
            msgState,
        );
    });

    return (
        <div
            class="wl--field-single-combo-box"
            hidden={merged.hidden}
        >
            <Label
                label={merged.label}
                for={merged.id}
                required={merged.required}
                hint={merged.hint}
                info={merged.info}
            />
            <button
                id={merged.id}
                class="wl--combo-box"
                type="button"
                onClick={handleComboBoxClick}
                popoverTarget={dropdownId}
                ref={button}
                disabled={merged.disabled}
            >
                {merged.startIcon}
                <Switch>
                    <Match
                        when={merged.placeholder && selectedOpt() === undefined}
                    >
                        <span class="wl--placeholder">
                            {merged.placeholder}
                        </span>
                    </Match>
                    <Match when={selectedOpt() !== undefined}>
                        <span class="wl--selected-label">
                            {selectedOptLabel()}
                        </span>
						<button class="wl--btn-deselect" onclick={deselect}>
                        	<XIcon classList={{ "wl--icon-deselect": true }} />
						</button>
                    </Match>
                </Switch>
                <ArrowDownOutlineIcon classList={{ "wl--icon-arrow": true }} />
            </button>
            <div
                id={dropdownId}
                class="wl--dropdown"
                popover
                onToggle={checkPopoverStatus}
                ref={dropdown}
            >
                <div class="wl--search-wrapper">
                    <SearchIcon />
                    <input
                        id={createUniqueId()}
                        type="text"
                        inputMode="text"
                        autocomplete="off"
                        ref={input}
                        onInput={loadOptsAndReset}
                    ></input>
                </div>
                <div
                    class="wl--opts-status"
                    ref={optsStatusContainer}
                >
                    <div
                        class="wl--opts"
                        ref={optsElem}
                    >
                        <For each={opts()}>
                            {(opt, idx) => (
                                <button
                                    class="wl--opt"
                                    classList={{
                                        selected:
                                            selectedOpt()?.value == opt.value,
                                    }}
                                    type="button"
                                    onMouseEnter={focusOnMouseEnter}
                                    data-idx={idx()}
                                    onclick={select}
                                >
                                    {opt.optLabel()}
                                    <Show
                                        when={selectedOpt()?.value == opt.value}
                                    >
                                        <CheckIcon />
                                    </Show>
                                </button>
                            )}
                        </For>
                    </div>
                    <Show when={status() != Status.Idle}>
                        <div class="wl--status">
                            <Switch>
                                <Match when={status() == Status.Loading}>
                                    <SpinnerLoader
                                        classList={{ "wl--loader": true }}
                                    />
                                </Match>
                                <Match when={status() == Status.Error}>
                                    <XCircleOutlineIcon
                                        classList={{ "wl--icon-err": true }}
                                    />
                                </Match>
                            </Switch>
                        </div>
                    </Show>
                </div>
            </div>
            <Msg state={msgState} />
        </div>
    );
}
