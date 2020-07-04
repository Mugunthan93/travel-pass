import { State, Action, StateContext, Store, Selector } from "@ngxs/store";
import { Navigate } from '@ngxs/router-plugin';
import { SearchType, SearchMode } from './search.state';
import { JourneyType } from './search/flight.state';
import { MenuController } from '@ionic/angular';
import { SharedService } from '../services/shared/shared.service';

export interface dashboard {
    upcomingTrips: upcomingTrips[]
}

export interface upcomingTrips {
    from: string,
    to: string,
    travelStartDate: string
}

export class GetDashboard{
    static readonly type = '[Dashboard] GetDashboard';
}

export class SearchFlight{
    static readonly type = '[Dashboard] SearchFlight';
    constructor() {
        
    }
}

export class SearchBus {
    static readonly type = '[Dashboard] SearchBus';
    constructor() {

    }
}

export class SearchHotel {
    static readonly type = '[Dashboard] SearchHotel';
    constructor() {

    }
}

export class UpcomingTrips {
    static readonly type = '[Dashboard] UpcomingTrips';
}


@State<dashboard>({
    name: 'Dashboard',
    defaults: {
        upcomingTrips: []
    }
})
export class DashboardState{

    constructor(
        private store: Store,
        public menuCtrl: MenuController,
        private sharedService : SharedService
    ) {
        
    }

    @Selector()
    static getUpcomingTrips(state: dashboard) {
        return state.upcomingTrips;
    }

    @Action(GetDashboard)
    getDashboard(states: StateContext<any>, action: SearchFlight) {
        this.menuCtrl.close('first');
        this.store.dispatch(new Navigate(['/', 'home', 'dashboard', 'home-tab']));
    }
    

    @Action(SearchFlight)
    searchFlight(states: StateContext<any>, action: SearchFlight) {
        this.store.dispatch(new SearchMode('flight'));
        this.store.dispatch(new SearchType('one-way'));
        this.store.dispatch(new JourneyType('one-way'));
        this.store.dispatch(new Navigate(['/', 'home', 'search', 'flight', 'one-way']));
        
    }

    @Action(SearchBus)
    searchBus() {
        this.store.dispatch(new SearchType('Bus'));
        this.store.dispatch(new Navigate(['/', 'home', 'search','bus']));
    }

    @Action(SearchHotel)
    searchHotel() {
        this.store.dispatch(new SearchType('Hotel'));
        this.store.dispatch(new Navigate(['/', 'home', 'search','hotel']));
    }

    @Action(UpcomingTrips)
    async upcomingTrips(states: StateContext<any>, action: UpcomingTrips) {
        try {
            const upcomingTripsResponse = await this.sharedService.upcomingTrips();
            let response = JSON.parse(upcomingTripsResponse.data);
            states.patchState({
                upcomingTrips: this.tripResponse(response.data)
            });
            console.log(response.data);
        }
        catch (error) {
            console.log(error);
        }
    }

    tripResponse(data : any[]) {
        let trip: upcomingTrips[] = [];
        data.forEach(
            (element, index, array) => {   
                let lastTrip = element.passenger_details.flight_details[0].Segments.length - 1;
                let lastFlight = element.passenger_details.flight_details[0].Segments[lastTrip].length - 1;

                trip[index] = {
                    from : element.passenger_details.flight_details[0].Segments[0][0].Origin.Airport.CityCode,
                    to : element.passenger_details.flight_details[0].Segments[lastTrip][lastFlight].Destination.Airport.CityCode,
                    travelStartDate : element.passenger_details.flight_details[0].Segments[0][0].Origin.DepTime
                }
            }
        );
        return trip;
    }
}