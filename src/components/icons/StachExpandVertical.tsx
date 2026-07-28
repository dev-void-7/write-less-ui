import { Props, Vars } from "./common.jsx";
export function StachExpandVerticalIcon(props: Props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="wl--icon"
            classList={props.classList}
            style={{
                display: props.hidden ? "none" : undefined,
            }}
            stroke={Vars.IconColor}
            stroke-width={Vars.IconWeight}
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <path d="m9.5 8-3 3a1.42 1.42 0 0 0 0 2l3 3m5-8 3 3a1.42 1.42 0 0 1 0 2l-3 3" />
        </svg>
    );
}
