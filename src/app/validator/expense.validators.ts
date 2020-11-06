import { FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";

export function ExpenseValidator() : ValidatorFn {

  return (control: FormControl) => {
    return {
      required : true
    }
  }
}
