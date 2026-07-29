import { Vars, Props } from "./common.jsx";

export function ArrowLongDownIcon(props: Props) {
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
                d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3"
            />
        </svg>
    );
}
