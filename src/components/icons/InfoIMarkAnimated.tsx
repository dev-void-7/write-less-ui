import { Props, Vars } from "./common.jsx";

export function InfoIMarkAnimatedIcon(props: Props) {
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
            <circle fill={`var(${Vars.ColorVar}, #3B82F6)`} cx="16" cy="16" r="0">
                <animate
                    attributeName="opacity"
                    values="0; 1; 1"
                    dur="0.35s"
                    begin="100ms"
                    fill="freeze"
                    calcMode="spline"
                    keyTimes="0; 0.6; 1"
                    keySplines="0.25 0.71 0.4 0.88; .59 .22 .87 .63"
                />
                <animate
                    attributeName="r"
                    values="0; 17.5; 16"
                    dur="0.35s"
                    begin="100ms"
                    fill="freeze"
                    calcMode="spline"
                    keyTimes="0; 0.6; 1"
                    keySplines="0.25 0.71 0.4 0.88; .59 .22 .87 .63"
                />
            </circle>
            <circle fill={`var(${Vars.ColorVar}, #3B82F6)`} cx="16" cy="16" r="12" opacity="0">
                <animate
                    attributeName="opacity"
                    values="1; 0"
                    dur="1s"
                    begin="320ms"
                    fill="freeze"
                    calcMode="spline"
                    keyTimes="0; 1"
                    keySplines="0.0 0.0 0.2 1"
                />
                <animate
                    attributeName="r"
                    values="12; 26"
                    dur="1s"
                    begin="320ms"
                    fill="freeze"
                    calcMode="spline"
                    keyTimes="0; 1"
                    keySplines="0.0 0.0 0.2 1"
                />
            </circle>
            <circle fill="white" cx="16" cy="9.5" r="0" opacity="0">
                <animate
                    attributeName="opacity"
                    values="0; 1"
                    dur="0.2s"
                    begin="250ms"
                    fill="freeze"
                    calcMode="spline"
                    keyTimes="0; 1"
                    keySplines="0.0, 0.0, 0.58, 1.0"
                />
                <animate
                    attributeName="r"
                    values="0; 2.5; 2"
                    dur="0.25s"
                    begin="250ms"
                    fill="freeze"
                    calcMode="spline"
                    keyTimes="0; 0.6; 1"
                    keySplines="0.25 0.71 0.4 0.88; .59 .22 .87 .63"
                />
            </circle>
            <path
                fill="none"
                stroke="#FCFCFC"
                stroke-width="3.5"
                stroke-dasharray="14"
                stroke-dashoffset="14"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14,15 L16,15 L16,23.5"
            >
                <animate
                    attributeName="stroke-dashoffset"
                    values="14;0"
                    dur="0.25s"
                    begin="350ms"
                    fill="freeze"
                    calcMode="spline"
                    keyTimes="0; 1"
                    keySplines="0.0, 0.0, 0.58, 1.0"
                />
            </path>
        </svg>
    );
}
