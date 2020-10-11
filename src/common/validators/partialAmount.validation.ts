import { FormControl } from '@angular/forms';
import { Utils } from '../utils/utils';

export class PartialAmountValidator {

    static isValid(control: FormControl): any {

        // console.log('control.value -> ', parseFloat(control.value))
        if (isNaN(control.value) || parseFloat(control.value) <= 0 || Utils.isEmpty(control.value)) {
            return {
                partialAmount :"Please enter amount"
            };
        }

        return null;
    }

}
