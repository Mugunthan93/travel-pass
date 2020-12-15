import { ValidatorFn, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { roomguest } from '../stores/search/hotel.state';
import { tap } from 'rxjs/operators';


export function RoomValidator(rooms$ : Observable<roomguest[]>): AsyncValidatorFn {
    return (): Observable<ValidationErrors> | null => {
        return rooms$.pipe(
            tap(
                (rooms : roomguest[]) => {
                    if (rooms.length <= 0) {
                        if (rooms.some((el) => el.NoOfAdults <= 0)) {
                            return {
                                adult : true
                            }
                        }
                        else if (rooms.some((el) => el.NoOfChild >= 1)) {
                            if (rooms.some((el) => ( el.NoOfChild == el.ChildAge.length ) && (el.ChildAge.some(el => el !== null)))) {
                                return {
                                    childage :true
                                }
                            }
                        }
                        return {
                            room : true
                        }
                    }
                    return null;
                }
            )
        );
    }
}