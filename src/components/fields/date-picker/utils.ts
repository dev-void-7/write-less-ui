import { FormState } from "../../form/types.js";
import { Merged, Output } from "./domain/props.js";
import { MsgState } from "../../msg/types.js";
import { DateObject } from "./domain/date-object.js";

export function registerFieldInForm<T extends Output>(
    form: FormState,
    merged: Merged<T>,
    input: HTMLInputElement,
    val: DateObject,
    msgState: MsgState,
) {
    const errCodes = [];
    if (merged.errCodes) errCodes.push(...merged.errCodes);
    if (merged.requiredCode) errCodes.push(merged.requiredCode);
    if (merged.maxCode) errCodes.push(merged.maxCode);
    if (merged.minCode) errCodes.push(merged.minCode);

    function validate() {
        if (merged.required && input.value.length == 0) {
            msgState.err(merged.requiredCode);
            return false;
        }

        if (merged.min !== undefined && val.before(merged.min)) {
            msgState.err(merged.minCode);
            return false;
        }

        if (merged.max !== undefined && val.after(merged.max)) {
            msgState.err(merged.maxCode);
            return false;
        }

        return true;
    }

    const getValue = merged.output == "object" ? () => val.val() : () => val.toHyphenedYyyyMmDd();

    form.registerField({
        getKey: () => merged.key,
        getValue,
        validate,
        elem: input,
        msgState,
        errCodes,
    });
}
