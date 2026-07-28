import { onMount } from "solid-js";
import { Props } from "./domain/props.js";
import { Groups } from "./parts/Groups.jsx";
import { CtxMenuContext } from "./CtxMenueContext.js";
import { State } from "./domain/state.js";

export function CtxMenu<T>(props: Props<T>) {
    const state = new State<T>();

    props.api.show = (data: T, anchorName: string, onHide?: () => void) =>
        state.showPopover(data, anchorName, onHide);
    props.api.hide = () => state.hidePopover();
    props.api.isOpen = () => state.isPopoverOpen();

    onMount(() => {
        state.addToggleListenerToPopover();
    });

    return (
        <CtxMenuContext.Provider value={state}>
            <div
                class="wl--ctx-menu"
                style={{
                    "position-anchor": state.anchorName(),
                }}
                popover
                ref={state.popover}
            >
                <Groups groups={props.groups} />
            </div>
        </CtxMenuContext.Provider>
    );
}
