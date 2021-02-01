import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(list: any[], property: string, order : string): any[] {

    let arr = Object.assign([],list);

    if (!Array.isArray(arr) || property == undefined) {
      return;
    }

    //string sorting
    if (property == 'HotelName' || property == 'hotel_name') {

      let sortedArray =  _.sortBy(arr, (o) => {
        return o[property];
      });

      if (order == 'default') {
        return sortedArray;
      }
      else if (order == 'rotated') {
        return sortedArray.reverse();
      }

    }

    else {

      arr.sort((a: any, b: any) => {
  
        //number sorting
        if (property == 'id' || property == 'fare' || property == 'Duration' || property == 'StarRating' || property == 'star_rating') {
          return this.numberSorting(a, b, property, order);
        }
        else if (property == 'PublishedPrice' || property == 'price') {
          return this.numberSorting(a.Price, b.Price, property, order);
        }
        //date sorting
        else if (property == 'departure' || property == 'arrival' || property == 'createdAt' || property == 'traveldate') {
          return this.dateSorting(a, b, property, order);
        }
      });

      return arr;

    }

  } 


  numberSorting(a: any, b: any, property: string, order: string) {
    console.log(a,b,property,order);
    if(a !== undefined &&  b !== undefined) {
      if (order == 'asc' || order == 'default') {
        if (parseInt(b[property]) < parseInt(a[property])) {
          return -1;
        }
        else if (parseInt(b[property]) > parseInt(a[property])) {
          return 1;
        }
        else {
          return 0;
        }
      }
      else if (order == 'des' || order == 'rotated') {
        if (parseInt(b[property]) > parseInt(a[property])) {
          return -1;
        }
        else if (parseInt(b[property]) < parseInt(a[property])) {
          return 1;
        }
        else {
          return 0;
        }
      }
    }
    else {
      return 0;
    }
  }

  dateSorting(a: any, b: any, property: string, order: string) {
    if (order == 'asc' || order == 'default') {
      if (moment(b[property]).isSameOrBefore(a[property],'date')) {
        return -1;
      }
      else if (moment(b[property]).isSameOrAfter(a[property],'date')) {
        return 1;
      }
      else if (moment(b[property]).isSame(a[property],'date')) {
        return 0;
      }
    }
    else if (order == 'des' || order == 'rotated') {
      if (moment(b[property]).isSameOrAfter(a[property],'date')) {
        return -1;
      }
      else if (moment(b[property]).isSameOrBefore(a[property],'date')) {
        return 1;
      }
      else if (moment(b[property]).isSame(a[property],'date')) {
        return 0;
      }
    }
  }

}
