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
import { handleOnMount, State } from "./utils.js";
import { SearchIcon } from "../../icons/SearchIcon.jsx";
import { XCircleOutlineIcon } from "../../icons/XCircleOutlineIcon.jsx";
import { SpinnerLoader } from "../../loaders/spinner.jsx";
import { XIcon } from "../../icons/X.jsx";

export function SingleComboBox<T, V, I>(props: Props<T, V, I>) {
    const merged = mergeProps(props, { id: createUniqueId(), perPage: 20 });

    const form = useFormContext();

    const [opts, setOpts] = createSignal<Array<Opt<V, I>>>([]);
    const [status, setStatus] = createSignal(Status.Idle);
    const [selectedOpt, setSelectedOpt] = createSignal<Opt<V, I> | undefined>();

    const dropdownId = createUniqueId();
    const msgState = form && new MsgState(form.props.mapCodeToMsg);
    const state = new State(merged, opts, setOpts, setStatus, setSelectedOpt);
	const {
		handleComboBoxClick,
		loadOptsAndReset,
		select,
		deselect,
		checkPopoverStatus,
	} = state.bindAndGetPubFns();

    const selectedOptLabel = () => {
        const sOpt = selectedOpt();
        return sOpt ? sOpt.selectionLabel?.() || sOpt.optLabel() : undefined;
    };

    onMount(() => {
        handleOnMount(
            form,
            merged,
            state.button,
            state.dropdown,
            state.optsElem,
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
                ref={state.button}
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
                        <button
                            class="wl--btn-deselect"
                            onclick={deselect}
                        >
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
                ref={state.dropdown}
            >
                <div class="wl--search-wrapper">
                    <SearchIcon />
                    <input
                        id={createUniqueId()}
                        type="text"
                        inputMode="text"
                        autocomplete="off"
                        ref={state.searchInput}
                        onInput={loadOptsAndReset}
                    ></input>
                </div>
                <div
                    class="wl--opts-status"
                    ref={state.optsStatusContainer}
                >
                    <div
                        class="wl--opts"
                        ref={state.optsElem}
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
