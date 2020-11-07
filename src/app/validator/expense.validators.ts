import { AsyncValidatorFn, FormControl, ValidationErrors } from "@angular/forms";
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, first, switchMap } from 'rxjs/operators';

export function ExpenseValidator(strArr : string[]) : AsyncValidatorFn {

  return (control: FormControl) : Observable<ValidationErrors | null> => {

    if (!((control.root.get("type") as FormControl).valueChanges)) {
      return of(null);
    } else {
      return (control.root.get("type") as FormControl).valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap(
          (value) => {
            if(strArr.some(el => el === value)) {
              return of({
                required : true
              });
            }
            else {
              return of(null);
            }
        })
      ).pipe(first())
    }

  }
}
