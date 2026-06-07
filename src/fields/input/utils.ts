import { FormState } from "../../form/types.js";
import { InputMode, Merged, Type } from "./types.js";
import { MsgState } from "../../msg/types.js";

export function handleOnMountWhenForm<T extends Type>(
    form: FormState,
    merged: Merged<T>,
    input: HTMLInputElement,
    msgState: MsgState,
) {
    switch (merged.type) {
        case "number":
            hanldeOnMountWhenFormForNumberInput(
                form,
                merged as Merged<"number">,
                input,
                msgState,
            );
            break;
        case "text":
            hanldeOnMountWhenFormForTextInput(
                form,
                merged as Merged<"text">,
                input,
                msgState,
            );
            break;
        case "password":
            hanldeOnMountWhenFormForPasswordInput(
                form,
                merged as Merged<"password">,
                input,
                msgState,
            );
            break;
        case "email":
            hanldeOnMountWhenFormForEmailInput(
                form,
                merged as Merged<"email">,
                input,
                msgState,
            );
            break;
        case "tel":
            hanldeOnMountWhenFormForTelInput(
                form,
                merged as Merged<"tel">,
                input,
                msgState,
            );
            break;
    }
}

function hanldeOnMountWhenFormForNumberInput(
    form: FormState,
    merged: Merged<"number">,
    input: HTMLInputElement,
    msgState: MsgState,
) {
    hanldeOnMountForNumberInput(merged, input);

    function validate() {
        if (merged.required && input.value.length == 0) {
            msgState.err(merged.requiredCode);
            return false;
        }

        const val = Number(input.value);

        if (merged.min !== undefined && val < merged.min) {
            msgState.err(merged.minCode);
            return false;
        }

        if (merged.max !== undefined && val > merged.max) {
            msgState.err(merged.maxCode);
            return false;
        }

        const code = merged.validator?.(val);

        if (code !== undefined) {
            msgState.err(code);
            return false;
        }

        return true;
    }

    form.registerField({
        getKey: () => merged.key,
        getValue: () => {
            const value = input.value;
            if (
                value.length == 0 ||
                value == "-" ||
                value == "+" ||
                value == "." ||
                value.startsWith("e") ||
                value.startsWith("E")
            )
                return undefined;
            return Number(input.value);
        },
        validate,
        elem: input,
        msgState,
    });
}

function hanldeOnMountWhenFormForTextInput(
    form: FormState,
    merged: Merged<"text">,
    input: HTMLInputElement,
    msgState: MsgState,
) {
    hanldeOnMountForTextInput(merged, input);

    function validate() {
        const val = input.value;
        const valLength = val.length;
        if (merged.required && valLength == 0) {
            msgState.err(merged.requiredCode);
            return false;
        }

        if (merged.min !== undefined && valLength < merged.min) {
            msgState.err(merged.minCode);
            return false;
        }

        if (merged.max !== undefined && valLength > merged.max) {
            msgState.err(merged.maxCode);
            return false;
        }

        const code = merged.validator?.(val);

        if (code !== undefined) {
            msgState.err(code);
            return false;
        }

        return true;
    }

    form.registerField({
        getKey: () => merged.key,
        getValue: () => input.value,
        validate,
        elem: input,
        msgState,
    });
}

function hanldeOnMountWhenFormForPasswordInput(
    form: FormState,
    merged: Merged<"password">,
    input: HTMLInputElement,
    msgState: MsgState,
) {
    hanldeOnMountForPasswordInput(merged, input);

    function validate() {
        const val = input.value;
        const valLength = val.length;
        if (merged.required && valLength == 0) {
            msgState.err(merged.requiredCode);
            return false;
        }

        if (merged.min !== undefined && valLength < merged.min) {
            msgState.err(merged.minCode);
            return false;
        }

        if (merged.max !== undefined && valLength > merged.max) {
            msgState.err(merged.maxCode);
            return false;
        }

        if (merged.minStrength !== undefined) {
            let strength = 0;

            if (valLength > 7) {
                strength++;
            }

            if (/[a-z]/.test(val)) {
                strength++;
            }

            if (/[A-Z]/.test(val)) {
                strength++;
            }

            if (/\d/.test(val)) {
                strength++;
            }

            if (/[^a-zA-Z\d]/.test(val)) {
                strength++;
            }

            if (strength < merged.minStrength) {
                msgState.err(merged.minStrengthCode);
                return false;
            }
        }

        const code = merged.validator?.(val);

        if (code !== undefined) {
            msgState.err(code);
            return false;
        }

        return true;
    }

    form.registerField({
        getKey: () => merged.key,
        getValue: () => input.value,
        validate,
        elem: input,
        msgState,
    });
}

function hanldeOnMountWhenFormForEmailInput(
    form: FormState,
    merged: Merged<"email">,
    input: HTMLInputElement,
    msgState: MsgState,
) {
    hanldeOnMountForEmailInput(merged, input);

    function validate() {
        const val = input.value;
        if (merged.required && val.length == 0) {
            msgState.err(merged.requiredCode);
            return false;
        }

        if (!input.checkValidity()) {
            // in case of Merged<"email"> this property is exists but it seems typescript has issue detecting that
            msgState.err(merged.invalidEmailCode!);
            return false;
        }

        const code = merged.validator?.(val);

        if (code !== undefined) {
            msgState.err(code);
            return false;
        }

        return true;
    }

    form.registerField({
        getKey: () => merged.key,
        getValue: () => input.value,
        validate,
        elem: input,
        msgState,
    });
}

function hanldeOnMountWhenFormForTelInput(
    form: FormState,
    merged: Merged<"tel">,
    input: HTMLInputElement,
    msgState: MsgState,
) {
    hanldeOnMountForTelInput(merged, input);

    function validate() {
        const val = input.value;
        if (merged.required && val.length == 0) {
            msgState.err(merged.requiredCode);
            return false;
        }

        const code = merged.validator?.(val);

        if (code !== undefined) {
            msgState.err(code);
            return false;
        }

        return true;
    }

    form.registerField({
        getKey: () => merged.key,
        getValue: () => input.value,
        validate,
        elem: input,
        msgState,
    });
}

export function handleOnMount<T extends Type>(
    merged: Merged<T>,
    input: HTMLInputElement,
) {
    switch (merged.type) {
        case "number":
            hanldeOnMountForNumberInput(merged as Merged<"number">, input);
            break;
        case "text":
            hanldeOnMountForTextInput(merged as Merged<"text">, input);
            break;
        case "password":
            hanldeOnMountForPasswordInput(merged as Merged<"password">, input);
            break;
        case "email":
            hanldeOnMountForEmailInput(merged as Merged<"email">, input);
            break;
        case "tel":
            hanldeOnMountForTelInput(merged as Merged<"tel">, input);
            break;
    }
}

function hanldeOnMountForNumberInput(
    merged: Merged<"number">,
    input: HTMLInputElement,
) {
    const onValueChange = merged.onValueChange;
    if (onValueChange) {
        input.addEventListener("input", (e: InputEvent) => {
            if (e.data == null) {
                onValueChange(undefined);
                return;
            } else if (["-", "e", "E", "+", "."].includes(e.data)) return;

            const num = Number(input.value);
            // this should never happen, but just in case
            if (Number.isNaN(num)) return;
            onValueChange(num);
        });
    }
}

function hanldeOnMountForTextInput(
    merged: Merged<"text">,
    input: HTMLInputElement,
) {
    const onValueChange = merged.onValueChange;
    if (onValueChange) {
        input.addEventListener("input", (e: InputEvent) => {
            onValueChange((e.target as HTMLInputElement).value);
        });
    }
}

function hanldeOnMountForPasswordInput(
    merged: Merged<"password">,
    input: HTMLInputElement,
) {
    const onValueChange = merged.onValueChange;
    if (onValueChange) {
        input.addEventListener("input", (e: InputEvent) => {
            onValueChange((e.target as HTMLInputElement).value);
        });
    }
}

function hanldeOnMountForEmailInput(
    merged: Merged<"email">,
    input: HTMLInputElement,
) {
    const onValueChange = merged.onValueChange;
    if (onValueChange) {
        input.addEventListener("input", (e: InputEvent) => {
            onValueChange((e.target as HTMLInputElement).value);
        });
    }
}

function hanldeOnMountForTelInput(
    merged: Merged<"tel">,
    input: HTMLInputElement,
) {
    const onValueChange = merged.onValueChange;
    if (onValueChange) {
        input.addEventListener("input", (e: InputEvent) => {
            onValueChange((e.target as HTMLInputElement).value);
        });
    }
}

export function inputMode<T extends Type>(t: T): InputMode {
    switch (t) {
        case "number":
            return "numeric";
        case "text":
        case "password":
            return "text";
        case "email":
            return "email";
        case "tel":
            return "tel";
        default:
            return "text";
    }
}
