import {
    createSignal,
    createUniqueId,
    For,
    mergeProps,
    onMount,
    untrack,
} from "solid-js";
import type { Opt, Props } from "./types.js";
import { Label } from "../common/label/Label.jsx";
import { useFormContext } from "../../form/FormContext.jsx";
import { MsgState } from "../../msg/types.js";
import { Msg } from "../../msg/Msg.jsx";
import { handleOnMount, handleOptsMutation } from "./utils.js";
import { focusOnMouseEnter } from "../common/utils/make-arrow-up-down-navigate-dropdown-opts.js";
import { ArrowDownOutlineIcon } from "../../icons/ArrowDownOutlineIcon.jsx";
import { CheckIcon } from "../../icons/CheckIcon.jsx";
import { Cols } from "../common/types/types.js";

export function Select<V, I>(props: Props<V, I>) {
    const merged = mergeProps(props, {
        id: createUniqueId(),
        cols: 12 as Cols,
    });
    const form = useFormContext();
    const [selectedOpt, setSelectedOpt] = createSignal<Opt<V, I> | undefined>();
    const dropdownId = createUniqueId();
    let dropdown!: HTMLDivElement;
    let button!: HTMLButtonElement;
    let opts!: HTMLDivElement;
    let msgState = form && new MsgState(form.props.mapCodeToMsg);

    handleOptsMutation(merged, selectedOpt, setSelectedOpt);

    function select(
        e: MouseEvent & {
            currentTarget: HTMLElement;
        },
    ) {
        if (merged.disabled) return;
        const opt = merged.opts[Number(e.currentTarget.dataset.idx)];
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
            opts,
            selectedOpt,
            msgState,
        );
    });

    return (
        <div
            class="wl--field-select"
            hidden={merged.hidden}
            style={{
                "grid-column": `span ${merged.cols}`,
            }}
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
                class="wl--select"
                type="button"
                popoverTarget={dropdownId}
                ref={button}
                disabled={merged.disabled}
            >
                {merged.startIcon}
                <span class="wl--selected-label">{selectedOpt()?.label()}</span>
                <ArrowDownOutlineIcon classList={{ "wl--icon-arrow": true }} />
            </button>
            <div
                id={dropdownId}
                class="wl--dropdown"
                popover
                ref={dropdown}
            >
                <div
                    class="wl--opts"
                    ref={opts}
                >
                    <For each={merged.opts}>
                        {(opt, idx) => (
                            <button
                                class="wl--opt"
                                classList={{
                                    selected: selectedOpt() == opt,
                                }}
                                type="button"
                                onMouseEnter={focusOnMouseEnter}
                                data-idx={idx()}
                                onclick={select}
                            >
                                {opt.label()}
                            </button>
                        )}
                    </For>
                </div>
                <CheckIcon hidden={selectedOpt() === undefined} />
            </div>
            <Msg state={msgState} />
        </div>
    );
}
