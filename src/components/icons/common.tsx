export const enum Vars {
    ColorVar = "--wl--icon-color",
    IconColor = `var(${Vars.ColorVar}, currentColor)`,
    IconWeight = "var(--wl--icon-weight, 1.25)",
}

export type Props = {
    classList?: {
        [key: string]: boolean | undefined;
    };
    hidden?: boolean;
};
