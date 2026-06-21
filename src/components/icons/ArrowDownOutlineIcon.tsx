import { Vars, Props } from "./common.jsx";

export function ArrowDownOutlineIcon(props: Props) {
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
                d="M18 9L12.8839 14.1161C12.3957 14.6043 11.6043 14.6043 11.1161 14.1161L6 9"
                stroke={Vars.IconColor}
                stroke-width={Vars.IconWeight}
                stroke-linecap="round"
            />
        </svg>
    );
}
