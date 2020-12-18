import { ValidatorFn, FormControl, AbstractControl } from '@angular/forms';
import * as moment from 'moment';

export function DateMatchValidator(start : string, end : string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        let startDate = moment(moment(control.root.get(start).value).format("YYYY-MM-DD 00:00:01.000+00:00"));
        let endDate = moment(moment(control.root.get(end).value).format("YYYY-MM-DD 00:00:01.000+00:00"));

        if ((startDate.isValid) && endDate.isValid)
        {
            console.log(moment(startDate).isBefore(moment(endDate)));
            return moment(startDate).isBefore(moment(endDate)) ? null : {
                'mismatch' : true
            }
        }
        else {
            return null;
        }
    }
}