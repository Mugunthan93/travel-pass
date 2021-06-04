import { ValidatorFn, FormControl, AbstractControl } from '@angular/forms';
import * as moment from 'moment';

export function DateMatchValidator(start : string, end : string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        if (control.root.get(start).value !== null && control.root.get(end).value !== null)
        {
            return moment(control.root.get(start).value).isBefore(control.root.get(end).value,'date') ? null : {
                'mismatch' : true
            }
        }
        return null;
    }
}

export function isFuterDate(date : string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {

    if(moment().isBefore(moment(control.root.get(date).value),'date')) {
      return {
        'futuredate' : true
      }
    }
    else {
      return null;
    }
  }
}

