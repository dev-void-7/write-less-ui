import { createUniqueId, mergeProps, onMount, Show } from "solid-js";
import { Props, Type } from "./types.js";
import { inputMode, handleOnMount, handleOnMountWhenForm } from "./utils.js";
import { Label } from "../common/label/Label.jsx";
import { useFormContext } from "../../form/FormContext.jsx";
import { Msg } from "../../msg/Msg.jsx";
import { MsgState } from "../../msg/types.js";
import { Cols } from "../common/types/types.js";

export function Input<T extends Type>(props: Props<T>) {
    const merged = mergeProps(
        {
            id: createUniqueId(),
            type: "text" as Type,
            inputMode: inputMode(props.type || "text"),
            cols: 12 as Cols,
        },
        props,
    );

    const form = useFormContext();
    // eslint-disable-next-line no-unassigned-vars
    let input!: HTMLInputElement;
    let msgState: MsgState | undefined;

    if (form) {
        msgState = new MsgState(form.props.mapCodeToMsg);
        onMount(() => {
            handleOnMountWhenForm(form, merged, input, msgState!);
        });
    } else {
        onMount(() => {
            handleOnMount(merged, input);
        });
    }

    const inputWrapper = (
        <div class="wl--input-wrapper">
            {merged.startIcon}
            <input
                id={merged.id}
                type={merged.type}
                inputmode={merged.inputMode}
                placeholder={merged.placeholder}
                ref={input}
                autocomplete="off"
            />
            {merged.endIcon}
        </div>
    );

    let middlePart;

    if (merged.startElem || merged.endElem) {
        middlePart = (
            <div class="wl--middle-part">
                {merged.startElem}
                {inputWrapper}
                {merged.endElem}
            </div>
        );
    } else {
        middlePart = inputWrapper;
    }

    return (
        <div
            class="wl--field-input"
            style={{
                display: merged.hidden ? "none" : undefined,
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
            {middlePart}
            <Msg state={msgState} />
        </div>
    );
}
