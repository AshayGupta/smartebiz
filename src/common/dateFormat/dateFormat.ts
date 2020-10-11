import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";

@Injectable()
export class DateFormat {

    constructor(
        private datePipe: DatePipe,
    ) {
    }

    formatYYYMMDDT(date: Date) {
        return this.datePipe.transform(date, "yyyy-MM-dd'T'00:00:00");
    }

    formatyyyyMMddHHmmss(date: Date) {
        return this.datePipe.transform(date, "yyyyMMddHHmmss");
    }
}