let _mapCodeToMsg = (_code: number) => "";

// NOTE: this is a hot path so browser engines might optimize it
export function mapCodeToMsg(code: number) {
    return _mapCodeToMsg(code);
}

export function setMapCodeToMsg(fn: (code: number) => string) {
    _mapCodeToMsg = fn;
}
