import { FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { Utils } from '../utils/utils';

export class AgeValidator {

    // static isValid(control: FormControl): any {

    //     // console.log('control.value -> ', parseFloat(control.value))
    //     if (isNaN(control.value) || parseFloat(control.value) == 0 || Utils.isEmpty(control.value)) {
            // return {
            //     loanAmount: 'Please enter amount'
            // };
    //     }

    //     return null;
    // }

    static isValid(minimum: number): ValidatorFn {
        return (control: AbstractControl): { [key: string]: string } | null => {
            if(control.value) {
                let age = Utils.getAgeFromString(control.value)
                if(age < minimum) {
                    return { age: 'Beneficiary underage please add nominee' };
                }
            }

            return null;
        };
    }
}


