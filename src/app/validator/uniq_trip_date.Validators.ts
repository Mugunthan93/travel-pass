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
            let start = moment(tripDates.startDate).format('YYYY-MM-DD');
            let end = moment(tripDates.endDate).format('YYYY-MM-DD');
            let range = moment(selectedDate).isBetween(start,end, 'date', '[]');
            // console.log(range,selectedDate,start,end);
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