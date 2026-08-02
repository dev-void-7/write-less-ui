import { FormContext } from "./FormContext.jsx";
import { Props } from "./types.js";
import { FormState } from "./state.js";
import { createUniqueId, Match, Switch } from "solid-js";

export function Form(props: Props) {
    const state = new FormState(props);

    return (
        <FormContext.Provider value={state}>
            <Switch>
                <Match when={props.tagless}>{props.children}</Match>
                <Match when={!props.tagless}>
                    <form
                        id={props.id || createUniqueId()}
                        class="wl--form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            state.submit();
                        }}
                    >
                        {props.children}
                    </form>
                </Match>
            </Switch>
        </FormContext.Provider>
    );
}
