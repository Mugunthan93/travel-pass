import { ValidatorFn, FormControl } from '@angular/forms';
import * as moment from 'moment';

export function DateMatchValidator(start : string, end : string): ValidatorFn {
    return (control: FormControl): { [key: string]: any } => {
        console.log(control);
        let startDate = control.root.get(start).value;
        let endDate = control.root.get(end).value;

        if (startDate !== null && endDate !== null)
        {
            return moment(startDate).isBefore(moment(endDate)) ? null : {
                'mismatch' : true
            }
        }
        else {
            return null;
        }
    }
}