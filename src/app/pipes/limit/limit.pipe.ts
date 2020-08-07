import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { takeUntil } from 'rxjs/operators';

@Pipe({
  name: 'limit'
})
export class LimitPipe implements PipeTransform {

  transform(list: Observable<any[]>, limit: Observable<number>): Observable<any> {
    return list.pipe(takeUntil(limit))
  }

}
