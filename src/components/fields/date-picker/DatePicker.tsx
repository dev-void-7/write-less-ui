import { createUniqueId, mergeProps, onMount } from "solid-js";
import { Output, Props } from "./domain/props.js";
import { Cols } from "../../common/types.js";
import { useFormContext } from "../../form/FormContext.jsx";
import { State } from "./domain/state.js";
import { Label } from "../common/label/Label.jsx";
import { Msg } from "../../msg/Msg.jsx";
import { MiddlePart } from "./parts/MiddlePart.jsx";
import { DatePickerContext } from "./contexts/state.js";

export function DatePicker<T extends Output>(props: Props<T>) {
    const merged = mergeProps(
        {
            id: createUniqueId(),
            output: "text" as Output,
            cols: 12 as Cols,
        },
        props,
    );
    const form = useFormContext();
    const state = new State(merged, form);

    if (form) {
        state.unsafeInitMsgState();
        onMount(() => {
            state.unsafeRegisterFieldInForm();
        });
    }

    return (
        <DatePickerContext.Provider value={state}>
            <div
                class="wl--field-date-picker"
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
                <MiddlePart />
                <Msg state={state.msgState} />
            </div>
        </DatePickerContext.Provider>
    );
}
