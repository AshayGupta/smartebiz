import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'mobileMasking',
})
export class MobileMaskingPipe implements PipeTransform {
    maskChar = '*';

    transform(input: string, visibleDigits: number = 3): string {
        if (input) {
            let maskedSection = input.slice(0, -visibleDigits);
            let visibleSection = input.slice(-visibleDigits);
            return maskedSection.replace(/./g, this.maskChar) + visibleSection;
        }
        return '';
    }
}
