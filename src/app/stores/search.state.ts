import { State } from "@ngxs/store";

@State({
    name : 'search',
    defaults: {
        oneWaySearch: null
      }
})
export class SearchState{

}