import { Range } from "../../../../types/range.js";

export class DateObject {
    year: number;
    month: Range<1, 12>;
    day: Range<1, 31>;

    constructor(year: number, month: Range<1, 12>, day: Range<1, 31>) {
        this.year = year;
        this.month = month;
        this.day = day;
    }

    static FromOther(other: DateObject): DateObject {
        return new this(other.year, other.month, other.day);
    }

    static empty(): DateObject {
        return new this(-1, 1, 1);
    }

    toHyphenedYyyyMmDd(): undefined | string {
        return this.empty() ? undefined : `${this.year}-${this.month}-${this.day}`;
    }

    val(): undefined | this {
        return this.empty() ? undefined : this;
    }

    empty(): boolean {
        return this.year == -1;
    }

    notEmpty(): boolean {
        return !this.empty();
    }

    before(other: DateObject) {
        return this.beforeYMD(other.year, other.month, other.day);
    }

    after(other: DateObject) {
        return this.afterYMD(other.year, other.month, other.day);
    }

    beforeYMD(year: number, month: Range<1, 12>, day: Range<1, 31>): boolean {
        if (this.year < year) return true;
        if (this.year != year) return false;
        if (this.month < month) return true;
        if (this.month != month) return false;
        return this.day < day;
    }

    afterYMD(year: number, month: Range<1, 12>, day: Range<1, 31>): boolean {
        if (this.year > year) return true;
        if (this.year != year) return false;
        if (this.month > month) return true;
        if (this.month != month) return false;
        return this.day > day;
    }
}
