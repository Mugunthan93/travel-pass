import { Pipe, PipeTransform } from '@angular/core';
import { hotelDetail } from 'src/app/stores/result/hotel.state';
import * as _ from 'lodash';

@Pipe({
  name: 'room'
})
export class RoomPipe implements PipeTransform {

  transform(list: hotelDetail[], property: any): any {
    let arr = Object.assign([], list);

    if (!Array.isArray(arr)) {
      return;
    }

    if (property == 'all') {
      return arr;
    }
    else {

      console.log(property);

      let filtered: hotelDetail[] = arr.filter(
        (el: hotelDetail) => {
          if (el.Amenities) {
            if (_.lowerCase(el.Amenities[0]) == property) {
              return el;
            }
          }
        }
      );
      console.log(filtered);
      return filtered;
    }

  }

}
