import { Vars, Props } from "./common.jsx";

export function ChevronRightIcon(props: Props) {
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
                d="m9 6 5.116 5.116a1.25 1.25 0 0 1 0 1.768L9 18"
                stroke={Vars.IconColor}
                stroke-width={Vars.IconWeight}
                stroke-linecap="round"
            />
        </svg>
    );
}
