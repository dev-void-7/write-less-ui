import { MsgState } from "../msg/types.js";
import { Props, Status, Field, Notifier } from "./types.js";

export class FormState {
    fields: Array<Field> = [];
    props: Props;
    status: Status = Status.Idle;
    msgState: MsgState;
    notifier?: Notifier | undefined;

    constructor(props: Props) {
        this.props = props;
        this.notifier = props.notifier;
        this.msgState = new MsgState(props.mapCodeToMsg);
    }

    registerField(field: Field): number {
        return this.fields.push(field) - 1;
    }

    async submit() {
        const body: { [key: string]: any } = {};
        for (const field of this.fields) {
            if (!field.validate()) {
                return;
            }
            body[field.getKey()] = field.getValue();
        }

        const errCode = await this.props.onSubmit(body);

        if (errCode == undefined) return;

        let mapped = false;

        for (const field of this.fields) {
            if (field.errCodes.includes(errCode)) {
                field.msgState.err(errCode);
                mapped = true;
            }
        }

        if (!mapped) {
            if (this.notifier) this.notifier.err(this.props.mapCodeToMsg(errCode));
            else this.msgState.err(errCode);
        }
    }
}
