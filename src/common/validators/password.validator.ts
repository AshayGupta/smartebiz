import { AbstractControl } from "@angular/forms";
import { Utils } from "../utils/utils";

export class PasswordValidator {

    static Match(firstControlName, secondControlName): any {
        return (AC: AbstractControl) => {
            let firstControlValue = AC.root.value[firstControlName]; // to get value in input tag
            let secondControlValue = AC.value; // to get value in input tag

            if (!Utils.isEmpty(firstControlValue) && !Utils.isEmpty(secondControlValue) && firstControlValue != secondControlValue && AC.root['controls']) {
                return {
                    MatchFields: true
                };
            } else {
                return null
            }
        };
    }

}