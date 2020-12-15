import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limit'
})
export class LimitPipe implements PipeTransform {

  transform(value: any[], limit: number): any {
    return value.filter(
      (...el) => {
        return el[1] < limit
      }
    );
  }

}
