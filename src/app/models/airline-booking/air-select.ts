import { airSearch } from './air-search';
import { bookingResponse, response } from '../response';

/////////////////////////////////////////////////////

export interface airFairQuoteResponse extends response{
    data : airFairQuoteData;
}

export interface airFairQuoteData{
    response : airFairQuoteDataResponse;
}

export interface airFairQuoteDataResponse extends bookingResponse{
    IsPriceChanged: false
    Results: airSearch;
}

///////////////////////////////////////////////////////

export interface airSSRResponse extends response{
    data : airSSRData;
}

export interface airSSRData{
    response : airSSR;
}

export interface airSSR extends bookingResponse{
    Baggage: baggage
    MealDynamic: mealDynamic
    SeatDynamic: seatDynamic
    SpecialServices: specialServices
}

////////////////////////////////////////////////////////

export interface baggage{

}

export interface mealDynamic{

}

export interface seatDynamic{

}

export interface specialServices{
    
}