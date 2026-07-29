export const enum Vars {
    IconColor = "var(--wl--icon-color, currentColor)",
    IconWeight = "var(--wl--icon-weight, 1.25)",
}

export type Props = {
    classList?: {
        [key: string]: boolean | undefined;
    };
    hidden?: boolean;
};
