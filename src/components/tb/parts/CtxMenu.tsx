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
import { ColGroup } from "../domain/cols/col-group.js";

export function CtxMenu(props: { state: State; api: ContextMenuApi<Col> }) {
    const expandCol = (col: Col) => {
        const by = props.state.computeTbWrapperAndTbWidthDiff();
        if (by <= 0) return;
        if (col instanceof ColLeaf) col.increaseSizeBy(by);
        else batch(() => col.increaseSizeBy(by));
    };
    const shrinkCol = (col: Col) => {
        if (col instanceof ColLeaf) col.shrinkToMin();
        else batch(() => col.shrinkToMin());
    };

    const autoFitCol = (col: Col) => {
        const by = props.state.computeTbWrapperAndTbWidthDiff();
        col.resizeBy(by);
    };
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
                    hidden: (col: Col) => col instanceof ColGroup,
                    type: GroupType.Radio,
                    items: [
                        { label: () => "Ascending", onclick: () => {}, icon: <BarsArrowUpIcon /> },
                        {
                            label: () => "Descending",
                            onclick: () => {},
                            icon: <BarsArrowDownIcon />,
                        },
                    ],
                },
            ]}
            api={props.api}
        />
    );
}
