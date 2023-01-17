import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const regexPseudo :RegExp = /[a-zA-Z0-9-_]{3,15}/g 

export {regexPseudo};

export function pseudoValidator(): ValidatorFn {
    return (ctrl: AbstractControl): null | ValidationErrors => {
        if (ctrl.value.match(regexPseudo)) {
            return null;//valide
        } else {
            return {
                pseudoValidator: ctrl.value
            };
        }
    };
};
