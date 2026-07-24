import { Vars, Props } from "./common.jsx";

export function ArrowDownFillIcon(props: Props) {
    return (
        <svg
            viewBox="5.2 8 13.6 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="wl--icon"
            classList={props.classList}
            style={{
                display: props.hidden ? "none" : undefined,
            }}
        >
            <path
                d="M12 17a1.72 1.72 0 0 1-1.33-.64l-4.21-5.1a2.1 2.1 0 0 1-.26-2.21A1.76 1.76 0 0 1 7.79 8h8.42a1.76 1.76 0 0 1 1.59 1.05 2.1 2.1 0 0 1-.26 2.21l-4.21 5.1A1.72 1.72 0 0 1 12 17"
                fill={Vars.IconColor}
            />
        </svg>
    );
}
