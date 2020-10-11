import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'emailMasking',
})
export class EmailMaskingPipe implements PipeTransform {
    maskChar = '*';

    transform(input: string, visibleDigits: number = 4): string {
        if (input) {
            let index = input.indexOf('@');
            input.slice(3, index);
            let part1 = input.slice(0, visibleDigits);
            let part2 = (input.slice(visibleDigits, input.indexOf('@'))).replace(/./g, this.maskChar);
            let part3 = (input.slice(input.indexOf('@')+1, input.lastIndexOf('.'))).replace(/./g, this.maskChar);
            let part4 = input.slice(input.lastIndexOf('.')+1);
            
            return part1 + part2 + '@' + part3 + part4
        }
        return '';
    }
}
