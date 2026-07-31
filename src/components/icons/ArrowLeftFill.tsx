import { Vars, Props } from "./common.jsx";

export function ArrowLeftFillIcon(props: Props) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="wl--icon"
            classList={props.classList}
            style={{
                display: props.hidden ? "none" : undefined,
            }}
        >
            <path
                d="M17.08 24a4.12 4.12 0 0 1-2.6-.92L4.283 14.66a3.4 3.4 0 0 1 0-5.319L14.481.922a4.2 4.2 0 0 1 4.42-.52A3.52 3.52 0 0 1 21 3.582V20.42a3.52 3.52 0 0 1-2.1 3.18 4.4 4.4 0 0 1-1.82.4"
                fill={Vars.IconColor}
            />
        </svg>
    );
}
