import { Pipe, PipeTransform } from '@angular/core';
import { meal } from 'src/app/stores/book/flight.state';

@Pipe({
  name: 'food'
})
export class FoodPipe implements PipeTransform {

  transform(value: any, veg : boolean, nonveg : boolean): any {
    if (veg && nonveg) {
      return value;
    }
    else if(veg && !nonveg) {
      return value.filter((el : meal) => el.Code.includes('VG') && !el.Code.includes('NV'));
    }
    else if (!veg && nonveg) {
      return value.filter((el: meal) => !el.Code.includes('VG') && el.Code.includes('NV'));
    }
    else if (!veg && !nonveg) {
      return value.filter((el: meal) => !el.Code.includes('VG') && !el.Code.includes('NV'));
    }
  }

}
