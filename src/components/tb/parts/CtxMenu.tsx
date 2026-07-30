import { CtxMenu as CtxMenuComponent } from "../../ctx-menu/CtxMenu.jsx";
import { Api as ContextMenuApi } from "../../ctx-menu/domain/props.js";
import { GroupType } from "../../ctx-menu/parts/Group.jsx";
import { Col } from "../domain/cols/col.js";
import { StachExpandVerticalIcon } from "../../icons/StachExpandVertical.jsx";
import { StachShrinkVerticalIcon } from "../../icons/StachShrinkVertical.jsx";
import { AutoFitVerticalIcon } from "../../icons/AutoFitVertical.jsx";
import { BarsArrowDownIcon } from "../../icons/BarsArrowDown.jsx";
import { BarsArrowUpIcon } from "../../icons/BarsArrowUp.jsx";
import { State } from "../domain/state.js";
import { batch } from "solid-js";
import { ColLeaf } from "../domain/cols/col-leaf.js";
import { SortDir } from "../../common/types.js";

export function CtxMenu<S>(props: { state: State<S>; api: ContextMenuApi<Col<S>> }) {
    const expandCol = (col: Col<S>) => {
        const by = props.state.computeTbWrapperAndTbWidthDiff();
        if (by <= 0) return;
        if (col instanceof ColLeaf) col.increaseSizeBy(by);
        else batch(() => col.increaseSizeBy(by));
    };
    const shrinkCol = (col: Col<S>) => {
        if (col instanceof ColLeaf) col.shrinkToMin();
        else batch(() => col.shrinkToMin());
    };

    const autoFitCol = (col: Col<S>) => {
        const by = props.state.computeTbWrapperAndTbWidthDiff();
        col.resizeBy(by);
    };

    const sortHidden = props.state.sorted ? hideIfNoSort : alwaysReturnTrue;

    return (
        <CtxMenuComponent
            groups={[
                {
                    items: [
                        {
                            label: () => "expand column",
                            onclick: expandCol,
                            icon: <StachExpandVerticalIcon />,
                        },
                        {
                            label: () => "shrink column",
                            onclick: shrinkCol,
                            icon: <StachShrinkVerticalIcon />,
                        },
                        {
                            label: () => "auto fit",
                            onclick: autoFitCol,
                            icon: <AutoFitVerticalIcon />,
                        },
                    ],
                },
                {
                    title: () => "SORT",
                    hidden: sortHidden,
                    type: GroupType.Radio,
                    onclick: (col: Col<S>, dir: SortDir) => {
                        // if sorted is `undefined` then this item will be hidden and won't be reached
                        props.state.sorted!.setBy({
                            key: (col as ColLeaf<S>).sortKey as S,
                            dir,
                        });
                    },
                    items: [
                        {
                            label: () => "Ascending",
                            value: SortDir.Asc,
                            icon: <BarsArrowUpIcon />,
                        },
                        {
                            label: () => "Descending",
                            value: SortDir.Desc,
                            icon: <BarsArrowDownIcon />,
                        },
                    ],
                },
            ]}
            api={props.api}
        />
    );
}

function hideIfNoSort<S>(col: Col<S>) {
    return !col || !("sortKey" in col) || col.sortKey === undefined;
}

function alwaysReturnTrue() {
    return true;
}
