import { ValidatorFn, AbstractControl, ValidationErrors, AsyncValidatorFn, FormControl } from '@angular/forms';

interface regexs {
    alphaonly: RegExp,
    email: RegExp,
    phone_number: RegExp,
    aadhar: RegExp,
    voter: RegExp,
    pan: RegExp,
    passport: RegExp
}

export function ProofValidator(proof : string) {

    let regex: regexs = {
        alphaonly: new RegExp("^[A-Za-z]+$"),
        email: new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        phone_number: new RegExp("^[0-9]{10}$"),
        aadhar: new RegExp("^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$"),
        voter: new RegExp("^([a-zA-Z]){3}([0-9]){7}?$"),
        pan: new RegExp("^[A-Z]{5}[0-9]{4}[A-Z]{1}$"),
        passport: new RegExp("^(?!^0+$)[a-zA-Z0-9]{6,9}$")
    }

    return (control: FormControl) : ValidationErrors => {
        switch (proof) {
            case 'Aadhar Card': return regex.aadhar.test(control.value) ? null : { valid : false };
            case 'Voter ID Card': return regex.voter.test(control.value) ? null : { valid : false };
            case 'PAN Card': return regex.pan.test(control.value) ? null : { valid : false };
            case 'Passport': return regex.passport.test(control.value) ? null : { valid : false };
            default: return null;
          }
    }
}