import { FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { Utils } from '../utils/utils';

export class LoanAmountValidator {

    // static isValid(control: FormControl): any {

    //     // console.log('control.value -> ', parseFloat(control.value))
    //     if (isNaN(control.value) || parseFloat(control.value) == 0 || Utils.isEmpty(control.value)) {
            // return {
            //     loanAmount: 'Please enter amount'
            // };
    //     }

    //     return null;
    // }

    static isValid(maxAmt: string): ValidatorFn {
        return (control: AbstractControl): { [key: string]: string } | null => {
            if(isNaN(control.value) || parseFloat(control.value) == 0 || Utils.isEmpty(control.value)) {
                return { loanAmount: 'Please enter amount' };
            }
            else if(parseFloat(control.value) > parseFloat(maxAmt)) {
                return { loanAmount: 'Amount must not be exceed the maximum amount' };
            }
            return null;
        };
    }
}


