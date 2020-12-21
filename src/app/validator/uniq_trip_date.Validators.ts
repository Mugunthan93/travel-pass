import { AbstractControl, AsyncValidatorFn, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';



export function UniqTripValidators(tripDates$ : Observable<any[]>)
{
    return (control: AbstractControl): Observable<ValidationErrors> | null => {
        return tripDates$
            .pipe(
                map(
                    (tripDates) => {
                            // console.log(tripDates);
                            let selectedDate = control.value;

                            if(control.value == null) {
                                return null;
                            }

                            let datePresence = tripDates.some(
                                (date) => {
                                    console.log(date);
                                    let afterStart = moment(selectedDate).isSameOrAfter(date.startDate,'date');
                                    let beforeEnd = moment(selectedDate).isSameOrBefore(date.endDate,'date');
                                    return afterStart && beforeEnd;
                                }
                            );
                            // console.log(control,datePresence);
                            if(datePresence) {
                                return {
                                    'hasDate' : true
                                }
                            }
                        }
                ),
                first()
            );
    }
}

export function TripRangeValidators(tripDates : any)
{
    return (control: AbstractControl): ValidationErrors | null => {

        // console.log(tripDates);
        let selectedDate = control.value;

        if(control.value !== null) {
            let range = moment(selectedDate).isBetween(tripDates.startDate, tripDates.endDate, 'date', '[]');
            console.log(range);
            if(!range) {
                return {
                    "outOfRange" : true
                };
            }
            else {
                return null;
            }
        }
        return null;


    }
}