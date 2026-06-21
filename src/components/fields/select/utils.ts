import { Accessor, createEffect, Setter, untrack } from "solid-js";
import { type FormState } from "../../form/types.js";
import { Merged, Opt } from "./types.js";
import { type MsgState } from "../../msg/types.js";
import { makeArrowUpDownNavigateOpts } from "../common/utils/index.js";

export function handleOnMount<V, I>(
    form: FormState | undefined,
    merged: Merged<V, I>,
    button: HTMLButtonElement,
    dropdown: HTMLDivElement,
    opts: HTMLDivElement,
    selectedOpt: Accessor<Opt<V, I> | undefined>,
    msgState: MsgState | undefined,
) {
    const errCodes = [];
    if (merged.errCodes) errCodes.push(...merged.errCodes);
    if (merged.requiredCode) errCodes.push(merged.requiredCode);

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
        errCodes,
    });

    makeArrowUpDownNavigateOpts(dropdown, opts);
}

export function handleOptsMutation<V, I>(
    merged: Merged<V, I>,
    selectedOpt: Accessor<Opt<V, I> | undefined>,
    setSelectedOpt: Setter<Opt<V, I> | undefined>,
) {
    createEffect(() => {
        if (merged.opts.length == 0) {
            setSelectedOpt(undefined);
            return;
        }
        // selected option
        const so = untrack(selectedOpt);

        for (const opt of merged.opts) {
            if (opt == so) {
                return;
            }
        }

        setSelectedOpt(merged.opts[0]);
    });
}
