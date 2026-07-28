import { Props, Vars } from "./common.jsx";
export function MajestExpandLeftIcon(props: Props) {
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
                d="M20 8H11M20 12H4M7 15L4 12L7 9M20 16H11"
                stroke={Vars.IconColor}
                stroke-width={Vars.IconWeight}
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    );
}
