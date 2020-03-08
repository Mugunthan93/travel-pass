import { State } from "@ngxs/store";
import { city } from '../models/city';

export interface flightsearch{
  from: city
  to: city
  departure: Date
  traveller: any
  class: string
}

export interface Search{
  flight : flightsearch
}

@State<Search>({
    name : 'search',
    defaults: {
        flight : null
      }
})
export class SearchState{
  
}