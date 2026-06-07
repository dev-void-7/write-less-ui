import {
    createSignal,
    createUniqueId,
    For,
    mergeProps,
    onMount,
    Show,
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
    let msgState = form && new MsgState(form.props.mapCodeToMsg);
    let page = 1;
    let count = 0;
    let dropdown!: HTMLDivElement;
    let button!: HTMLButtonElement;
    let input!: HTMLInputElement;
    let optsElem!: HTMLDivElement;

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
                <span class="wl--selected-label">{selectedOptLabel()}</span>
                <ArrowDownOutlineIcon />
            </button>
            <div
                id={dropdownId}
                class="wl--dropdown"
                popover
                ref={dropdown}
            >
                <div class="wl--search-wrapper">
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
                    class="wl--opts"
                    onScrollEnd={handleOptsContainerScrollEnd}
                    ref={optsElem}
                >
                    <For each={opts()}>
                        {(opt, idx) => (
                            <button
                                class="wl--opt"
                                classList={{
                                    selected: selectedOpt()?.value == opt.value,
                                }}
                                type="button"
                                onMouseEnter={focusOnMouseEnter}
                                data-idx={idx()}
                                onclick={select}
                            >
                                {opt.optLabel()}
                                <Show when={selectedOpt()?.value == opt.value}>
                                    <CheckIcon />
                                </Show>
                            </button>
                        )}
                    </For>
                </div>
            </div>
            <Msg state={msgState} />
        </div>
    );
}
