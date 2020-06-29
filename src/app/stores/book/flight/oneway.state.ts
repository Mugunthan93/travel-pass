import { State, Action, Selector, Store, StateContext } from "@ngxs/store";
import { bookObj, baggageresponse, mealDynamic, SegmentSeat, flight, FLightBookState, sendRequest, SetFirstPassengers } from '../flight.state';
import { flightResult, flightSearchResult } from 'src/app/models/search/flight';
import { SSR } from '../../result/flight.state';
import { Navigate } from '@ngxs/router-plugin';
import { FlightService } from 'src/app/services/flight/flight.service';
import { OneWayResultState } from '../../result/flight/oneway.state';
import { BaseFlightBook } from './flight-book';
import { OneWaySearch } from '../../search/flight/oneway.state';
import { SearchState } from '../../search.state';


export interface onewayBook {
    fareQuote: flightResult,
    isPriceChanged: boolean,
    ssr: SSR,
    flight: bookObj,
    risk: string,
    mail: string[],
    purpose: string,
    comment: string
}

export interface confirmRequest {
    cc: string[]
    purpose: string,
    comment: string
}

export class CancellationRisk {
    static readonly type = "[OneWay] CancellationRisk";
    constructor(public risk : string) {
    }

}

export class MailCC {
    static readonly type = "[OneWay] MailCC";
    constructor(public mail : string[]) {

    }
}

export class Purpose {
    static readonly type = "[OneWay] Purpose";
    constructor(public purpose : string) {

    }
}

export class Comment {
    static readonly type = "[OneWay] Comment";
    constructor(public comment : string) {

    }
}

export class BookTicket {
    static readonly type = "[OneWay] BookTicket";

}

export class SendRequest {
    static readonly type = "[OneWay] SendRequest";
    constructor(public value: confirmRequest) {

    }
}

@State<onewayBook>({
    name: 'oneway_book',
    defaults: {
        fareQuote: null,
        isPriceChanged : null,
        ssr: null,
        flight: {
            summary: null,
            trip: []
        },
        risk: null,
        mail: [],
        purpose: null,
        comment: null
    }
})

export class OneWayBookState extends BaseFlightBook{

    constructor(
        public store: Store,
        private flightService : FlightService
    ) {
        super(store);
    }

    @Selector()
    static getPassengerFare(states: onewayBook) {
        return states.fareQuote.Fare;
    }

    @Selector()
    static getFlightDetail(states: onewayBook): bookObj {
        return states.flight;
    }

    @Action(BookTicket)
    async bookTicket(states: StateContext<onewayBook>) {

        try {
            const fairQuoteResponse = await this.flightService.fairQuote(this.store.selectSnapshot(OneWayResultState.getSelectedFlight).fareRule);
            if (fairQuoteResponse.status = 200) {
                let response = JSON.parse(fairQuoteResponse.data).response;
                if (response.Results) {
                    states.patchState({
                        fareQuote: response.Results,
                        isPriceChanged: response.IsPriceChanged
                    });

                }
                else if (response.Error.ErrorCode == 6) {
                    console.log(response.Error.ErrorMessage);
                    this.store.dispatch(new OneWaySearch());
                    return;
                }
            }
        }
        catch (error) {
            console.log(error);
        }

        try {
            const SSRResponse = await this.flightService.SSR(this.store.selectSnapshot(OneWayResultState.getSelectedFlight).fareRule);
            if (SSRResponse.status = 200) {
                let response = JSON.parse(SSRResponse.data).response;
                states.patchState({
                    ssr : response
                    });
            }
        }
        catch (error) {
            console.log(error);
        }

        states.patchState({
            flight: this.bookData(states.getState().fareQuote)
        });

        this.store.dispatch(new SetFirstPassengers(this.store.selectSnapshot(SearchState.getSearchType)));
        this.store.dispatch(new Navigate(['/', 'home', 'book', 'flight', 'one-way']));
        // try {
        //     const agencyBalanceResponse = await this.flightService.agencyBalance();
        //     console.log(agencyBalanceResponse);
        // }
        // catch (error) {
        //     console.log(error);
        // }

    }

    @Action(CancellationRisk)
    cancellationRisk(states: StateContext<onewayBook>, action: CancellationRisk) {
        states.patchState({
            risk : action.risk
        });
    }

    @Action(SendRequest)
    sendRequest(states: StateContext<onewayBook>, action: SendRequest) {

    }

    @Action(MailCC)
    mailCC(states: StateContext<onewayBook>, action: MailCC) {
        states.patchState({
            mail: action.mail
        });
    }

    @Action(Purpose)
    purpose(states: StateContext<onewayBook>, action: Purpose) {
        states.patchState({
            purpose: action.purpose
        });
    }

    @Action(Comment)
    comment(states: StateContext<onewayBook>, action: Comment) {
        states.patchState({
            comment: action.comment
        });
    }
}
