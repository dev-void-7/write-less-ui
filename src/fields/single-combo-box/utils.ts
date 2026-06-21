import { Accessor } from "solid-js";
import { Merged, Opt } from "./types.js";
import { FormState } from "../../form/state.js";
import { MsgState } from "../../msg/types.js";
import { makeArrowUpDownNavigateOpts } from "../common/utils/make-arrow-up-down-navigate-dropdown-opts.js";
import { State } from "./state.js";

export function handleOnMount<T, V, I>(
    form: FormState | undefined,
    merged: Merged<T, V, I>,
    state: State<T, V, I>,
    msgState: MsgState | undefined,
) {
    const errCodes = [];
    if (merged.errCodes) errCodes.push(...merged.errCodes);
    if (merged.requiredCode) errCodes.push(merged.requiredCode);

    form?.registerField({
        getKey: () => merged.key,
        getValue: () => state.selectedOpt()?.value,
        elem: state.button,
        msgState: msgState as MsgState,
        validate: () => {
            if (merged.required && state.selectedOpt() == undefined) {
                (msgState as MsgState).err(merged.requiredCode);
                return false;
            }
            return true;
        },
        errCodes,
    });

    makeArrowUpDownNavigateOpts(state.dropdown, state.optsElem);
}
