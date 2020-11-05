import { AsyncValidatorFn, FormControl, ValidationErrors } from "@angular/forms";
import { Observable, of } from 'rxjs';
import { first, flatMap, map, switchMap, take } from 'rxjs/operators';

export function ExpenseValidator(type : string): AsyncValidatorFn {
  return (control: FormControl) : Observable<ValidationErrors | null> => {

    if (!control.root.get('type').valueChanges) {
      return of(null);
    } else {
      return control.root.get('type').valueChanges.pipe(
        switchMap(
          (value) => {
            if(value == type) {
              return of({
                required : true
              });
            }
            else {
              return of(null);
            }
          }),
      ).pipe(first())
    }
  };
}
