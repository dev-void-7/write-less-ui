import { Props, Vars } from "./common.jsx";

export function MajestExpandRightIcon(props: Props) {
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
        >
            <path
                d="M4 8H13M4 12H20M17 15L20 12L17 9M4 16H13"
                stroke={Vars.IconColor}
                stroke-width={Vars.IconWeight}
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    );
}
