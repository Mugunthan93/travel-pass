import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { gradeValue } from "../stores/eligibility.state";


export function ExpenseCostValidator(domestic : gradeValue, int : gradeValue) : ValidatorFn {

    
    return (control: AbstractControl): ValidationErrors | null => {
        console.log(domestic,int,control); 
        return null;

        // if(control.parent.value.travel_type == 'domestic') {
        //     if(control.parent.value.type == 'hotel') {
        //         if(amt < (cost/days)) {
        //             return {
        //                 cost : true
        //             }
        //         }
        //         else {
        //             return null;
        //         }
        //     }
        //     }
        //     else {
        //         console.log(amt,cost);
        //         if(amt < cost) {
        //             return {
        //                 cost : true
        //             }
        //         }
        //         else {
        //             return null;
        //         }
        //     }
        // }
        // else if(control.parent.value.travel_type == 'international') {
        //     if() {
        //         if(amt < (cost/days)) {
        //             return {
        //                 cost : true
        //             }
        //         }
        //         else {
        //             return null;
        //         }
        //     }
        //     }
        //     else {
        //         console.log(amt,cost);
        //         if(amt < cost) {
        //             return {
        //                 cost : true
        //             }
        //         }
        //         else {
        //             return null;
        //         }
        //     }
        // }

    }
}
