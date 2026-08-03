import { Props } from "./common.jsx";

export function WarningExclamationMarkAnimatedIcon(props: Props) {
    return (
        <svg
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            class="wl--icon"
            classList={props.classList}
            style={{
                display: props.hidden ? "none" : undefined,
                overflow: "visible",
            }}
        >

            <circle cx="16" cy="16" r="0" fill="#F59E0B">
                <animate
                    attributeName="opacity"
                    values="0; 1; 1"
                    dur="0.35s"
                    begin="100ms"
                    fill="freeze"
                    calcMode="spline"
                    keyTimes="0; 0.6; 1"
                    keySplines="0.25 0.71 0.4 0.88; .59 .22 .87 .63"
                ></animate>
                <animate
                    attributeName="r"
                    values="0; 17.5; 16"
                    dur="0.35s"
                    begin="100ms"
                    fill="freeze"
                    calcMode="spline"
                    keyTimes="0; 0.6; 1"
                    keySplines="0.25 0.71 0.4 0.88; .59 .22 .87 .63"
                ></animate>
            </circle>
            <circle cx="16" cy="16" r="12" opacity="0" fill="#F59E0B">
                <animate
                    attributeName="opacity"
                    values="1; 0"
                    dur="1s"
                    begin="320ms"
                    fill="freeze"
                    calcMode="spline"
                    keyTimes="0; 1"
                    keySplines="0.0 0.0 0.2 1"
                ></animate>
                <animate
                    attributeName="r"
                    values="12; 26"
                    dur="1s"
                    begin="320ms"
                    fill="freeze"
                    calcMode="spline"
                    keyTimes="0; 1"
                    keySplines="0.0 0.0 0.2 1"
                ></animate>
            </circle>
            <path
                fill="none"
                stroke-width="4"
                stroke-dasharray="9"
                stroke-dashoffset="9"
                stroke-linecap="round"
                d="M16,7l0,9"
                stroke="#FFFFFF"
            >
                <animate
                    attributeName="stroke-dashoffset"
                    values="9;0"
                    dur="0.2s"
                    begin="250ms"
                    fill="freeze"
                    calcMode="spline"
                    keyTimes="0; 1"
                    keySplines="0.0, 0.0, 0.58, 1.0"
                ></animate>
            </path>
            <circle cx="16" cy="23" r="2.5" opacity="0" fill="#FFFFFF">
                <animate
                    attributeName="opacity"
                    values="0;1"
                    dur="0.25s"
                    begin="350ms"
                    fill="freeze"
                    calcMode="spline"
                    keyTimes="0; 1"
                    keySplines="0.0, 0.0, 0.58, 1.0"
                ></animate>
            </circle>
        </svg>
    );
}
