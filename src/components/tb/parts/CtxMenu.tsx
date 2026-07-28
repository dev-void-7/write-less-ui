import { CtxMenu as CtxMenuComponent } from "../../ctx-menu/CtxMenu.jsx";
import { Api as ContextMenuApi } from "../../ctx-menu/domain/props.js";
import { GroupType } from "../../ctx-menu/parts/Group.jsx";
import { Col } from "../domain/cols/col.js";
import { StachExpandVerticalIcon } from "../../icons/StachExpandVertical.jsx";
import { StachShrinkVerticalIcon } from "../../icons/StachShrinkVertical.jsx";
import { BarsArrowDownIcon } from "../../icons/BarsArrowDown.jsx";
import { BarsArrowUpIcon } from "../../icons/BarsArrowUp.jsx";

export function CtxMenu(props: { api: ContextMenuApi<Col> }) {
    console.log(props.api);
    return (
        <CtxMenuComponent
            groups={[
                {
                    items: [
                        {
                            label: () => "extend column",
                            onclick: () => {},
                            icon: <StachExpandVerticalIcon />,
                        },
                        {
                            label: () => "shrink column",
                            onclick: () => {},
                            icon: <StachShrinkVerticalIcon />,
                        },
                    ],
                },
                {
                    title: () => "SORT",
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
