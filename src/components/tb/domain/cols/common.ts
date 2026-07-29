import { Col } from "./col.js";

export function getColOrder(id: string, n: number): Array<number> {
    let items = localStorage.getItem(`tb_col__${id}`);
    if (items === null) return arrFromZeroToN(n);
    items = JSON.parse(items);
    if (!Array.isArray(items) || !allItemsAreInteger(items)) return arrFromZeroToN(n);
    if (items.length !== n) {
        for (let i = items.length; i < n; i++) {
            items.push(i);
        }
        localStorage.setItem(`tb_col__${id}`, JSON.stringify(items));
    }
    return items;
}

function arrFromZeroToN(n: number): number[] {
    return Array.from({ length: n }).map((_, i) => i);
}

function allItemsAreInteger(items: Array<number>): boolean {
    return items.every((item) => Number.isInteger(item));
}

export function getOrderedCols<S>(cols: Array<Col<S>>, order: Array<number>): Array<Col<S>> {
    const ordered: Array<Col<S>> = [];
    for (let i = 0; i < cols.length; i++) {
        ordered.push(cols[order[i]]);
    }
    return ordered;
}
