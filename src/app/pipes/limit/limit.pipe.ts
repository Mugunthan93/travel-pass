import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limit'
})
export class LimitPipe implements PipeTransform {

  transform(value: any[], limit: number): any {
    return value.filter(
      (el,ind,arr) => {
        return ind < limit
      }
    );
  }

}
