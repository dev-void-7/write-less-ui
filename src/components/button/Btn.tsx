import { Props } from "./types.js";

export function Btn(props: Props) {
    return (
        <button
            class="wl--btn"
            type={props.type || "button"}
            style={{
                display: props.hidden ? "none" : undefined,
                "grid-column": `span ${props.cols || 12}`,
            }}
            form={props.formId}
        >
            {props.startIcon}
            <div class="wl--children">{props.children}</div>
            {props.endIcon}
        </button>
    );
}
