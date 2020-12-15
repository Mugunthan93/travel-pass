import { ValidatorFn, FormControl, AbstractControl } from '@angular/forms';
import * as moment from 'moment';

export function DateMatchValidator(start : string, end : string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        let startDate = moment(control.root.get(start).value).startOf('date');
        let endDate = moment(control.root.get(end).value).endOf('date');

        if ((startDate.isValid) && endDate.isValid)
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