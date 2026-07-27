import { Props } from "./domain/props.js";
import { Groups } from "./parts/Groups.jsx";

export function CtxMenu<T>(props: Props<T>) {
    // eslint-disable no-unassigned-vars
    let popover!: HTMLDivElement;
    // eslint-enable no-unassigned-vars
    const state = {
        data: undefined as T,
    };
    // @ts-ignore
    props.ref({
        show: (data: T) => {
            state.data = data;
            popover.showPopover();
        },
        hide: () => {
            popover.hidePopover();
        },
    });

    return (
        <div class="wl--ctx-menu" popover ref={popover}>
            <Groups groups={props.groups} state={state} />
        </div>
    );
}
