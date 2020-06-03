import { State, Action, StateContext, Selector } from '@ngxs/store';
import { SharedService } from '../services/shared/shared.service';

export interface Shared {
    city : city[]
}

export interface city {
    airport_code: string
    airport_name: string
    city_code: string
    city_name: string
    country_code: string
    country_name: string
    currency: string
    nationalty: string
}

export class GetCity {
    static readonly type = '[Shared] GetCity';
    constructor(public city : string) {
        
    }
}

export class ClearCity {
    static readonly type = '[Shared] ClearCity';
}

@State<Shared>({
    name: 'Shared',
    defaults: {
        city : []
    }
})
export class SharedState {
    
    constructor(
        private sharedService: SharedService
    ) {

    }

    @Selector()
    static cities(state: Shared) {
        return state.city;
    }

    @Action(GetCity, {cancelUncompleted: true})
    async getCity(states: StateContext<Shared>, action: GetCity) {
        try {
            const city = await this.sharedService.searchCity(action.city);
            console.log(city);
            const parsedCity = JSON.parse(city.data);
            states.setState({
                city: parsedCity
            });
        }
        catch (error) {
            console.log(error);  
        }
    }

    @Action(ClearCity)
    clearCity(states: StateContext<Shared>, action: GetCity) {
        states.setState({
            city : []
        });
    }
}