import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const regexPassword :RegExp = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}/g;  //Minimum 8 caractères, maximum 15 caractères, au moins une lettre majuscule, une lettre minuscule, un caractères special et un chiffre
export {regexPassword};

export function passwordValidator(): ValidatorFn {
    return (ctrl: AbstractControl): null | ValidationErrors => {
        if (ctrl.value.match(regexPassword)) {
            return null;//valide
        } else {
            return {
                passwordValidator: ctrl.value
            };
        }
    };
};