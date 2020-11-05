import { ValidatorFn, FormControl, Validators } from "@angular/forms";

export function ExpenseValidator(key : string): ValidatorFn {
  return (control: FormControl): { [key: string]: any } => {
    console.log(control);
    let type = control.root.get('type').value;
        if (type == "flight" || type == "bus" || type == "train") {
          switch (key) {
              case "end_city": return Validators.required;
              case "end_date": return Validators.required;
              case "no_of_days": return Validators.required;
          }
        }
        else if (type == "hotel" || type == "food") {
          switch (key) {
              case "end_date": return Validators.required;
              case "no_of_days": return Validators.required;
          }
        }
        else if (type == "localtravel" || type == "othertravel") {
            switch (key) {
              case "end_city": return Validators.required;
              case "local_travel_value": return Validators.required;
          }
        }
  };
}
