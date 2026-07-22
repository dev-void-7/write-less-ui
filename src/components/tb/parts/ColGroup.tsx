import { For } from "solid-js";
import { Cols } from "../domain/index.js";

export function ColGroup(props: { cols: Cols }) {
    const cols = props.cols;
    return (
        <colgroup>
            <For each={cols.orderedLeafs().filter((leaf) => !leaf.hidden())}>
                {(leaf) => (
                    <col
                        style={{
                            "--col-width": `${leaf.width()}px`,
                        }}
                    />
                )}
            </For>
        </colgroup>
    );
}
