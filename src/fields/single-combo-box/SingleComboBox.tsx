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
import { Merged, Opt, Props, Status } from "./types.js";
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
import { XIcon } from "../../icons/X.jsx";
import { State } from "./state.js";

export function SingleComboBox<T, V, I>(props: Props<T, V, I>) {
    const merged = mergeProps(props, { id: createUniqueId(), perPage: 20 });

    const form = useFormContext();

    const state = new State(merged);
    const msgState = form && new MsgState(form.props.mapCodeToMsg);

    onMount(() => {
        handleOnMount(form, merged, state, msgState);
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
            <ControlPart
                merged={merged}
                state={state}
            />
            <DropdownPart state={state} />
            <Msg state={msgState} />
        </div>
    );
}

function ControlPart<T, V, I>(props: {
    merged: Merged<T, V, I>;
    state: State<T, V, I>;
}) {
    const { merged, state } = props;
    return (
        <button
            id={merged.id}
            class="wl--combo-box"
            type="button"
            onClick={state.handleComboBoxClick.bind(state)}
            popoverTarget={state.dropdownId}
            ref={state.button}
            disabled={merged.disabled}
        >
            {merged.startIcon}
            <ControlSelectedLabelOrPlaceholderPart
                merged={merged}
                state={state}
            />
            <ArrowDownOutlineIcon classList={{ "wl--icon-arrow": true }} />
        </button>
    );
}

function ControlSelectedLabelOrPlaceholderPart<T, V, I>(props: {
    merged: Merged<T, V, I>;
    state: State<T, V, I>;
}) {
    const { merged, state } = props;

    return (
        <Switch>
            <Match
                when={merged.placeholder && state.selectedOpt() === undefined}
            >
                <span class="wl--placeholder">{merged.placeholder}</span>
            </Match>
            <Match when={state.selectedOpt() !== undefined}>
                <span class="wl--selected-label">
                    {state.selectedOptLabel()}
                </span>
                <button
                    class="wl--btn-deselect"
                    onclick={state.deselect.bind(state)}
                >
                    <XIcon classList={{ "wl--icon-deselect": true }} />
                </button>
            </Match>
        </Switch>
    );
}

function DropdownPart<T, V, I>(props: { state: State<T, V, I> }) {
    const state = props.state;

    return (
        <div
            id={state.dropdownId}
            class="wl--dropdown"
            popover
            onToggle={state.checkPopoverStatus.bind(state)}
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
                    onInput={state.loadOptsAndReset.bind(state)}
                ></input>
            </div>
            <div
                class="wl--opts-status"
                ref={state.optsStatusContainer}
            >
                <OptsPart state={state} />
                <StatusPart state={state} />
            </div>
        </div>
    );
}

function OptsPart<T, V, I>(props: { state: State<T, V, I> }) {
    const state = props.state;
    return (
        <div
            class="wl--opts"
            ref={state.optsElem}
        >
            <For each={state.opts()}>
                {(opt, idx) => (
                    <button
                        class="wl--opt"
                        classList={{
                            selected: state.selectedOpt()?.value == opt.value,
                        }}
                        type="button"
                        onMouseEnter={focusOnMouseEnter}
                        data-idx={idx()}
                        onclick={state.select.bind(state)}
                    >
                        {opt.optLabel()}
                        <Show when={state.selectedOpt()?.value == opt.value}>
                            <CheckIcon />
                        </Show>
                    </button>
                )}
            </For>
        </div>
    );
}

function StatusPart<T, V, I>(props: { state: State<T, V, I> }) {
    const state = props.state;
    return (
        <Show when={state.status() != Status.Idle}>
            <div class="wl--status">
                <Switch>
                    <Match when={state.status() == Status.Loading}>
                        <SpinnerLoader classList={{ "wl--loader": true }} />
                    </Match>
                    <Match when={state.status() == Status.Error}>
                        <XCircleOutlineIcon
                            classList={{ "wl--icon-err": true }}
                        />
                    </Match>
                </Switch>
            </div>
        </Show>
    );
}
