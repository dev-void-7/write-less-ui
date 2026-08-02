export type Cols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export enum SortDir {
    Asc,
    Desc,
}

export interface Notifier {
    err: (msg: string) => void;
    warn: (msg: string) => void;
    scs: (msg: string) => void;
    info: (msg: string) => void;
}
