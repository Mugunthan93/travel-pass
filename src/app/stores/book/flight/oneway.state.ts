import { State, Action, Selector, Store, StateContext } from "@ngxs/store";
import { bookObj, baggageresponse, mealDynamic, SegmentSeat, flight, FLightBookState } from '../flight.state';
import { flightResult } from 'src/app/models/search/flight';
import { SSR } from '../../result/flight.state';
import { Navigate } from '@ngxs/router-plugin';
import { FlightService } from 'src/app/services/flight/flight.service';
import { OneWayResultState } from '../../result/flight/oneway.state';


export interface onewayBook {
    flight: bookObj,
    baggage: baggageresponse[][],
    meal: mealDynamic[][],
    seat: SegmentSeat[],
    specialServices: any[]
}

export class BookTicket {
    static readonly type = "[OneWay] BookTicket";

}

@State<onewayBook>({
    name: 'oneway_book',
    defaults: {
        flight: {
            summary: null,
            trip: []
        },
        baggage: [],
        meal: [],
        seat: [],
        specialServices: []
    }
})

export class OneWayBookState {

    constructor(
        public store: Store,
        private flightService : FlightService
    ) {
    }

    @Selector()
    static getFlightDetail(states: onewayBook): bookObj {
        return states.flight;
    }

    @Action(BookTicket)
    async bookTicket(states: StateContext<flight>) {

        let fairQuote: flightResult = null;
        let ssr: SSR = null;

        try {
            const fairQuoteResponse = await this.flightService.fairQuote(this.store.selectSnapshot(OneWayResultState.getSelectedFlight).fareRule);
            console.log(fairQuoteResponse);
            if (fairQuoteResponse.status = 200) {
                let response = JSON.parse(fairQuoteResponse.data).response;
                if (response.Results) {
                    console.log(response.Results);
                    fairQuote = response.Results;
                }
                else if (response.Error.ErrorCode == 6) {
                    console.log(response.Error.ErrorMessage);
                }
            }
        }
        catch (error) {
            console.log(error);
        }

        try {
            const SSRResponse = await this.flightService.SSR(this.store.selectSnapshot(OneWayResultState.getSelectedFlight).fareRule);
            console.log(SSRResponse);
            if (SSRResponse.status = 200) {
                ssr = JSON.parse(SSRResponse.data).response;
                console.log(ssr);
            }
        }
        catch (error) {
            console.log(error);
        }

        states.patchState({
            flight: null,
            // flight: this.bookData(fairQuote),
            baggage: ssr.Baggage,
            meal: ssr.MealDynamic,
            seat: ssr.SeatDynamic,
            specialServices: ssr.specialServices
        });
        this.store.dispatch(new Navigate(['/', 'home', 'book', 'flight', 'one-way']));
        // try {
        //     const agencyBalanceResponse = await this.flightService.agencyBalance();
        //     console.log(agencyBalanceResponse);
        // }
        // catch (error) {
        //     console.log(error);
        // }

    }
}
