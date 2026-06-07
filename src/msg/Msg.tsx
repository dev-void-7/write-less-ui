import { Show } from "solid-js";
import { MsgState, Props, Status } from "./types.js";

export function Msg(props: Props) {
	if (props.state === undefined) {
		return <></>;
	}

	const state = props.state;

    const show = () => state.code() && state.status() !== Status.None;
    const classList = () => ({
        [state.status()]: true,
    });

    return (
        <Show when={show()}>
            <div class="wl--msg" classList={classList()}>
                {props.state.msg}
            </div>
        </Show>
    );
}