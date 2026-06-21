import { Vars, Props } from "./common.jsx";

export function CheckIcon(props: Props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="wl--icon"
            classList={props.classList}
            stroke={Vars.IconColor}
            stroke-width={Vars.IconWeight}
            style={{
                display: props.hidden ? "none" : undefined,
            }}
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
            />
        </svg>
    );
}
