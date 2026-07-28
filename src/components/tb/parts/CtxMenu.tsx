import { CtxMenu as CtxMenuComponent } from "../../ctx-menu/CtxMenu.jsx";
import { Api as ContextMenuApi } from "../../ctx-menu/domain/props.js";
import { GroupType } from "../../ctx-menu/parts/Group.jsx";
import { Col } from "../domain/cols/col.js";

export function CtxMenu(props: { api: ContextMenuApi<Col> }) {
    console.log(props.api);
    return (
        <CtxMenuComponent
            groups={[
                {
                    items: [
                        { label: () => "extend column", onclick: () => {} },
                        { label: () => "shrink column", onclick: () => {} },
                    ],
                },
                {
                    title: () => "ORDER",
                    type: GroupType.Radio,
                    items: [
                        { label: () => "Ascending", onclick: () => {} },
                        { label: () => "Descending", onclick: () => {} },
                    ],
                },
            ]}
            api={props.api}
        />
    );
}
