import { createSignal, onMount } from "solid-js";
import { Props } from "./domain/props.js";
import { Groups } from "./parts/Groups.jsx";
import { CtxMenuContext } from "./CtxMenueContext.js";

export function CtxMenu<T>(props: Props<T>) {
    // eslint-disable no-unassigned-vars
    let popover!: HTMLDivElement;
    // eslint-enable no-unassigned-vars
    const [data, setData] = createSignal<T>(undefined as T);
    const [anchorName, setAnchorName] = createSignal<string | undefined>(undefined);
    let open = false;
    let onHide: (() => void) | undefined;

    function show(data: T, anchorName: string, pOnHide?: () => void) {
        if (open) {
            popover.hidePopover();
        }
        setTimeout(() => {
            // @ts-ignore
            setData(data);
            setAnchorName(anchorName);
            onHide = pOnHide;
            popover.showPopover();
        });
    }

    function hide() {
        popover.hidePopover();
    }

    function isOpen() {
        return open;
    }

    props.api.show = show;
    props.api.hide = hide;
    props.api.isOpen = isOpen;

    onMount(() => {
        popover.addEventListener("toggle", (e) => {
            if (e.newState == "closed") {
                setAnchorName(undefined);
                onHide?.();
                open = false;
            } else {
                open = true;
            }
        });
    });

    return (
        <CtxMenuContext.Provider value={data}>
            <div
                class="wl--ctx-menu"
                style={{
                    "position-anchor": anchorName(),
                }}
                popover
                ref={popover}
            >
                <Groups groups={props.groups} />
            </div>
        </CtxMenuContext.Provider>
    );
}
