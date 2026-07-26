import { For, Show } from "solid-js";
import { Props } from "./domain.js";

export function CtxMenu<T>(props: Props<T>) {
    // eslint-disable no-unassigned-vars
    let popover!: HTMLDivElement;
    // eslint-enable no-unassigned-vars
    let data: T;
    // @ts-ignore
    props.ref({
        show: (pData: T) => {
            data = pData;
            popover.showPopover();
        },
        hide: () => {
            popover.hidePopover();
        },
    });

    return (
        <div class="wl--ctx-menu" popover ref={popover}>
            <For each={props.items}>
                {(item) => (
                    <button type="button" class="wl--item" onclick={() => item.onclick(data)}>
                        {item.icon}
                        <div class="label">{item.label()}</div>
                        <Shortcut items={item.shortcut} />
                    </button>
                )}
            </For>
        </div>
    );
}

function Shortcut(props: { items?: Array<string> }) {
    return (
        <Show when={props.items}>
            <div class="wl--shortcut">
                <For each={props.items}>{(item) => <span class="wl--item">{item}</span>}</For>
            </div>
        </Show>
    );
}
