import { mergeProps } from "solid-js";
import { BtnTheme, Props } from "./types.js";

export function Btn(props: Props) {
    const merged = mergeProps({ theme: BtnTheme.Primary }, props);
    return (
        <button
            class="wl--btn"
            classList={{
                primary: merged.theme == BtnTheme.Primary,
                secondary: merged.theme == BtnTheme.Secondary,
                outline: merged.outline,
            }}
            type={merged.type || "button"}
            style={{
                display: merged.hidden ? "none" : undefined,
                "grid-column": `span ${merged.cols || 12}`,
            }}
            form={merged.formId}
        >
            {merged.startIcon}
            <div class="wl--children">{merged.children}</div>
            {merged.endIcon}
        </button>
    );
}
