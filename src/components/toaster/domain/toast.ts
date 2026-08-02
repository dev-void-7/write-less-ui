export interface Toast {
    id: number;
    content: string;
    type: Type;
    duration: number;
}

export const enum Type {
    Error,
    Success,
    Warning,
    Info,
}
