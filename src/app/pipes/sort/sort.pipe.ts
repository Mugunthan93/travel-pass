import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(list: any[], property: string): any[] {

    let arr = Object.assign([],list);

    if (!Array.isArray(arr)) {
      return;
    }
    arr.sort((a: any, b: any) => {
      if (a[property] < b[property]) {
        return -1;
      } else if (a[property] > b[property]) {
        return 1;
      } else {
        return 0;
      }
    });
    return arr;
  }

}
