import { Props, Vars } from "./common.jsx";

export function ArrowUpFillIcon(props: Props) {
    return (
        <svg
            viewBox="5.2 7 13.6 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="wl--icon"
            classList={props.classList}
            style={{
                display: props.hidden ? "none" : undefined,
            }}
        >
            <path
                d="M16.21 16H7.79a1.76 1.76 0 0 1-1.59-1 2.1 2.1 0 0 1 .26-2.21l4.21-5.1a1.76 1.76 0 0 1 2.66 0l4.21 5.1A2.1 2.1 0 0 1 17.8 15a1.76 1.76 0 0 1-1.59 1"
                fill={Vars.IconColor}
            />
        </svg>
    );
}
