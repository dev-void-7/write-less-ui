import { FormContext } from "./FormContext.jsx";
import { Props } from "./types.js";
import { FormState } from "./state.js";

export function Form(props: Props) {
    const state = new FormState(props);

    return (
        <FormContext.Provider value={state}>
            <form onSubmit={(e) => e.preventDefault()}>{props.children}</form>
        </FormContext.Provider>
    );
}
