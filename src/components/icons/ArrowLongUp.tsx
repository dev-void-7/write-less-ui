import { Vars, Props } from "./common.jsx";

export function ArrowLongUpIcon(props: Props) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="wl--icon"
            classList={props.classList}
            stroke-width={Vars.IconWeight}
            stroke={Vars.IconColor}
            style={{
                display: props.hidden ? "none" : undefined,
            }}
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18"
            />
        </svg>
    );
}
