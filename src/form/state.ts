import { Props, Status, Field } from "./types.js";

export class FormState {
    fields: Array<Field> = [];
    props: Props;
    status: Status = Status.Idle;

    constructor(props: Props) {
        this.props = props;
    }

    registerField(field: Field): number {
        return this.fields.push(field) - 1;
    }
}
