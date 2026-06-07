import { Accessor, Setter } from "solid-js";
import { Merged, Opt, Status } from "./types.js";
import { FormState } from "../../form/state.js";
import { MsgState } from "../../msg/types.js";
import { makeArrowUpDownNavigateOpts } from "../common/utils/make-arrow-up-down-navigate-dropdown-opts.js";


export function handleOnMount<T, V, I>(
	form: FormState | undefined,
	merged: Merged<T, V, I>,
	button: HTMLButtonElement,
	dropdown: HTMLDivElement,
	opts: HTMLDivElement,
	selectedOpt: Accessor<Opt<V, I> | undefined>,
	msgState: MsgState | undefined,
) {
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
	});

	makeArrowUpDownNavigateOpts(dropdown, opts);
}
