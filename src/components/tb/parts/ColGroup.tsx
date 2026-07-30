import { For } from "solid-js";
import { Cols } from "../domain/index.js";

export function ColGroup(props: { cols: Cols }) {
    const cols = props.cols;
    const totalColWidths = () => {
        let total = 0;
        for (const leaf of cols.orderedVisibleLeafs()) {
            const width = leaf.width();
            if (width === undefined) continue;
            total += width;
        }
        return total;
    };
    return (
        <colgroup style={{ "--total-col-widths": `${totalColWidths()}` }}>
            <For each={cols.orderedVisibleLeafs()}>
                {(leaf) => (
                    <col
                        style={{
                            "--col-width": `${leaf.width()}`,
                        }}
                    />
                )}
            </For>
        </colgroup>
    );
}
