import { Vars, Props } from "./common.jsx";

export function ArrowRightFillIcon(props: Props) {
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
                d="M6.92 24a4.4 4.4 0 0 1-1.82-.4A3.52 3.52 0 0 1 3 20.42V3.582A3.52 3.52 0 0 1 5.1.402a4.2 4.2 0 0 1 4.42.52l10.198 8.42a3.4 3.4 0 0 1 0 5.319L9.519 23.08a4.12 4.12 0 0 1-2.6.919"
                fill={Vars.IconColor}
            />
        </svg>
    );
}
