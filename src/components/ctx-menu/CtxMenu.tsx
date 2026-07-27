import { createSignal } from "solid-js";
import { Props } from "./domain/props.js";
import { Groups } from "./parts/Groups.jsx";
import { CtxMenuContext } from "./CtxMenueContext.js";

export function CtxMenu<T>(props: Props<T>) {
    // eslint-disable no-unassigned-vars
    let popover!: HTMLDivElement;
    // eslint-enable no-unassigned-vars
    const [data, setData] = createSignal<T>(undefined as T);
    const [anchorName, setAnchorName] = createSignal<string | undefined>(undefined);

    // @ts-ignore
    props.ref({
        show: (data: T, anchorName: string) => {
            // @ts-ignore
            setData(data);
            setAnchorName(anchorName);
            setTimeout(() => popover.showPopover());
        },
        hide: () => {
            setAnchorName(undefined);
            popover.hidePopover();
        },
    });

    return (
        <CtxMenuContext.Provider value={data}>
            <div
                class="wl--ctx-menu"
                style={{
                    "anchor-name": anchorName(),
                }}
                popover
                ref={popover}
            >
                <Groups groups={props.groups} />
            </div>
        </CtxMenuContext.Provider>
    );
}
