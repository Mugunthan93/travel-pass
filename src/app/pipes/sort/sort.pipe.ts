import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(list: any[], property: string, order : string): any[] {

    let arr = Object.assign([],list);

    if (!Array.isArray(arr)) {
      return;
    }
    arr.sort((a: any, b: any) => {

      //number sorting
      if (property == 'id' || property == 'fare' || property == 'Duration') {
        if (order == 'asc' || order == 'default') {
          if (b[property] < a[property]) {
            return -1;
          }
          else if (b[property] > a[property]) {
            return 1;
          }
          return 0;
        }
        else if (order == 'des' || order == 'rotated' ) {
          if (b[property] > a[property]) {
            return -1;
          } else if (b[property] < a[property]) {
            return 1;
          } else {
            return 0;
          }
        }
      }
      //date sorting
      else if (property == 'departure' || property == 'arrival') {
        if (order == 'asc' || order == 'default') {
          if (moment(b[property]).isBefore(a[property])) {
            return -1;
          }
          else if (moment(b[property]).isAfter(a[property])) {
            return 1;
          }
          else if (moment(b[property]).isSame(a[property])) {
            return 0;
          }
        }
        else if (order == 'des' || order == 'rotated') {
          if (moment(b[property]).isAfter(a[property])) {
            return -1;
          }
          else if (moment(b[property]).isBefore(a[property])) {
            return 1;
          }
          else if (moment(b[property]).isSame(a[property])) {
            return 0;
          }
        }
      }
    });
    return arr;
  }

}
