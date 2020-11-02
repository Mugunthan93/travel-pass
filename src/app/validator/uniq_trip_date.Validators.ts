import { AsyncValidatorFn, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';



export function UniqTripValidators(tripDates$ : Observable<any[]>): AsyncValidatorFn
{
    return (control: FormControl): Observable<ValidationErrors> | null => {
        return tripDates$
            .pipe(
                map(
                    (tripDates) => {
                            console.log(control);
                            let selectedDate = control.value;
                            let datePresence = tripDates.some(
                                (date,ind,arr) => {
                                    return moment(selectedDate).isBetween(date.startDate,date.endDate);
                                }
                            );
                            console.log(control,datePresence);
                            if(datePresence) {
                                return {
                                    'hasDate' : true
                                }
                            }
                            else {
                                return null;
                            }
                        }
                ),
                first()
            );
    }
}