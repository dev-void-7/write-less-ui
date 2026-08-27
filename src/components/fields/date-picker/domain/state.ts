import { Accessor, batch, createSignal, Setter } from "solid-js";
import { FormState } from "../../../form/types.js";
import { MsgState } from "../../../msg/types.js";
import { DateObject } from "./date-object.js";
import { Merged, Output } from "./props.js";
import { Range } from "../../../../types/range.js";

export class State<T extends Output> {
    merged: Merged<T>;
    form: FormState | undefined;
    button!: HTMLButtonElement;
    val: DateObject;
    picked: Accessor<string | undefined>;
    setPicked: Setter<string | undefined>;
    view: Accessor<View>;
    setView: Setter<View>;
    sYear: Accessor<number>;
    setSYear: Setter<number>;
    sMonth: Accessor<Range<1, 12>>;
    setSMonth: Setter<Range<1, 12>>;
    sDay: Accessor<Range<1, 31>>;
    setSDay: Setter<Range<1, 31>>;
    msgState: MsgState | undefined;

    constructor(merged: Merged<T>, form?: FormState) {
        this.merged = merged;
        this.form = form;
        this.val = merged.dflt ? DateObject.FromOther(merged.dflt) : DateObject.empty();
        [this.picked, this.setPicked] = createSignal<string | undefined>(
            this.val.toHyphenedYyyyMmDd(),
        );
        [this.view, this.setView] = createSignal<View>(View.Days);
        [this.sYear, this.setSYear] = createSignal(0);
        [this.sMonth, this.setSMonth] = createSignal<Range<1, 12>>(1);
        [this.sDay, this.setSDay] = createSignal<Range<1, 31>>(1);
    }

    autoSetSelectedYMD() {
        if (this.val.notEmpty()) {
            this.setSelectedYMD(this.val.year, this.val.month, this.val.day);
            return;
        }

        const [year, month, day] = currentYMD();
        const { max, min } = this.merged;

        if (max && max.beforeYMD(year, month, day)) {
            this.setSelectedYMD(max.year, max.month, max.day);
            return;
        }

        if (min && min.afterYMD(year, month, day)) {
            this.setSelectedYMD(min.year, min.month, min.day);
            return;
        }

        this.setSelectedYMD(year, month, day);
    }

    setSelectedYMD(year: number, month: Range<1, 12>, day: Range<1, 31>) {
        batch(() => {
            this.setSYear(year);
            this.setSMonth(month);
            this.setSDay(day);
        });
    }

    unsafeInitMsgState() {
        this.msgState = new MsgState(this.form!.props.mapCodeToMsg);
    }

    unsafeRegisterFieldInForm() {
        const errCodes = [];
        if (this.merged.errCodes) errCodes.push(...this.merged.errCodes);
        if (this.merged.requiredCode) errCodes.push(this.merged.requiredCode);
        if (this.merged.maxCode) errCodes.push(this.merged.maxCode);
        if (this.merged.minCode) errCodes.push(this.merged.minCode);

        const validate = () => {
            if (this.merged.required && this.val.empty()) {
                this.msgState!.err(this.merged.requiredCode);
                return false;
            }

            if (this.merged.min !== undefined && this.val.before(this.merged.min)) {
                this.msgState!.err(this.merged.minCode);
                return false;
            }

            if (this.merged.max !== undefined && this.val.after(this.merged.max)) {
                this.msgState!.err(this.merged.maxCode);
                return false;
            }

            return true;
        };

        const getValue =
            this.merged.output == "object"
                ? () => this.val.val()
                : () => this.val.toHyphenedYyyyMmDd();

        this.form!.registerField({
            getKey: () => this.merged.key,
            getValue,
            validate,
            elem: this.button,
            msgState: this.msgState!,
            errCodes,
        });
    }
}

export const enum View {
    Years,
    Days,
}

function currentYMD(): [number, Range<1, 12>, Range<1, 31>] {
    const now = new Date();
    return [now.getFullYear(), (now.getMonth() + 1) as Range<1, 12>, now.getDate() as Range<1, 31>];
}
