import { flightResult, flightData } from 'src/app/models/search/flight';
import { itinerarytrip, emailtrip, resultObj, trips, baggage, fareRule } from '../flight.state';
import * as moment from 'moment';



export class BaseFlightResult {

    constructor() {

    }

    responseData(response: flightResult[], traceId: string): resultObj[] {

        let resultObj: resultObj[] = new Array(response.length);

        response.forEach(
            (element: flightResult, index, array) => {
                resultObj[index] = this.resultObj(element, traceId);
            }
        );

        return resultObj;
    }

    resultObj(result: flightResult, traceId: string): resultObj {

        let resultObj: resultObj;
        let trips: trips[] = new Array(result.Segments.length);
        let totalDuration: number = 0;
        let lastArrival: string;
        let stops: number = 0;
        let baggage: baggage[][] = [];
        let email: itinerarytrip = {
            class: this.getCabinClass(result.Segments[0][0].CabinClass),
            refundable: result.IsRefundable == true ? 'refund' : 'non-refund',
            fare: result.Fare.PublishedFare,
            flights: []
        };

        result.Segments.forEach(
            (el, ind, arr) => {

                baggage[ind] = [];

                let lastFlight = el.length - 1;
                email.flights[ind] = {
                    origin: {
                        name: el[0].Origin.Airport.CityName,
                        code: el[0].Origin.Airport.CityCode
                    },
                    destination: {
                        name: el[lastFlight].Destination.Airport.CityName,
                        code: el[lastFlight].Destination.Airport.CityCode
                    },
                    passenger_detail: "1 Adult",
                    connecting_flight: []
                }

                el.forEach(
                    (e, i, a) => {

                        email.flights[ind].connecting_flight[i] = {
                            airlineCode: e.Airline.AirlineCode,
                            airlineName: e.Airline.AirlineName,
                            airlineNumber: e.Airline.FlightNumber,
                            origin: {
                                name: e.Origin.Airport.CityName,
                                code: e.Origin.Airport.CityCode,
                                date: e.Origin.DepTime
                            },
                            destination: {
                                name: e.Destination.Airport.CityName,
                                code: e.Destination.Airport.CityCode,
                                date: e.Destination.ArrTime
                            },
                            duration: moment.duration(e.Duration, 'minutes').days() + "d " + moment.duration(e.Duration, 'minutes').hours() + "h " + moment.duration(e.Duration, 'minutes').minutes() + "m"
                        }

                        baggage[ind][i] = {
                            logo:e.Airline.AirlineCode,
                            originName: e.Origin.Airport.CityName,
                            destinationName: e.Destination.Airport.CityName,
                            baggage: e.Baggage,
                            cabinBaggage: e.CabinBaggage
                        }
                    }
                );


                lastArrival = el[el.length - 1].Destination.ArrTime;
                totalDuration += this.getDuration(el);
                stops = stops < el.length ? el.length : stops;

                trips[ind] = {
                    from: "null",
                    to: "null",
                    departure: "null",
                    tripinfo: {
                        logo: el[0].Airline.AirlineCode,
                        airline: {
                            name: el[0].Airline.AirlineName,
                            code: el[0].Airline.AirlineCode,
                            number: el[0].Airline.FlightNumber
                        },
                        depTime: el[0].Origin.DepTime,
                        arrTime: el[el.length - 1].Destination.ArrTime,
                        class: this.getCabinClass(el[0].CabinClass),
                        duration: moment.duration(this.getDuration(el), 'minutes').hours() + "h " + moment.duration(this.getDuration(el), 'minutes').minutes() + "m",
                        day: moment.duration(this.getDuration(el), 'minutes').days() >= 1 ? true : false,
                        stops: el.length == 1 ? 'Non Stop' : el.length - 1 + " Stop",
                        seats: el[0].NoOfSeatAvailable,
                        fare: result.Fare.PublishedFare,
                        currency: result.Fare.Currency
                    }
                }
            });

        let fareRule: fareRule = {
            ResultIndex: result.ResultIndex,
            TraceId: traceId
        }

        resultObj = {
            name: result.Segments[0][0].Airline.AirlineName,
            fare: result.Fare.PublishedFare,
            refund: result.IsRefundable,
            Duration: totalDuration,
            departure: result.Segments[0][0].Origin.DepTime,
            arrival: lastArrival,
            currency: result.Fare.Currency,
            seats: result.Segments[0][0].NoOfSeatAvailable,
            trips: trips,
            baggage: baggage,
            connectingFlights: result.Segments,
            fareRule: fareRule,
            stops: stops,
            email: email
        };

        return resultObj;
    }

    emailTrips(response: flightResult[]): emailtrip {

        let lastSegment = response[0].Segments.length - 1;
        let lastconnectingflight = response[0].Segments[lastSegment].length - 1;

        return {
            departure: {
                name: response[0].Segments[0][0].Origin.Airport.CityName,
                code: response[0].Segments[0][0].Origin.Airport.CityCode
            },
            arrival: {
                name: response[0].Segments[lastSegment][lastconnectingflight].Destination.Airport.CityName,
                code: response[0].Segments[lastSegment][lastconnectingflight].Destination.Airport.CityCode
            }
        }
    }

    getCabinClass(cls: string) {
        if (cls == "1" || "2") {
            return "economy"
        }
        else if (cls == "3") {
            return "premium economy";
        }
        else if (cls == "4") {
            return "bussiness";
        }
        else if (cls == "5") {
            return "first class";
        }
    }

    getDuration(data: flightData[]): number {
        let time: number = 0;
        data.forEach(
            (e, i, a) => {
                time += (e.GroundTime + e.Duration);
            }
        );
        return time;
    }

    ascDuration(currentState: resultObj[]): resultObj[] {
        return currentState.slice().sort(
            (a: resultObj, b: resultObj) => {
                if (b.Duration < a.Duration) {
                    return -1;
                }
                else if (b.Duration > a.Duration) {
                    return 1;
                }
                return 0;
            }
        );
    }

    desDuration(currentState: resultObj[]): resultObj[] {
        return currentState.slice().sort(
            (a: resultObj, b: resultObj) => {
                if (b.Duration > a.Duration) {
                    return -1;
                }
                else if (b.Duration < a.Duration) {
                    return 1;
                }
                return 0;
            }
        );
    }

    ascDeparture(currentState: resultObj[]): resultObj[] {
        return currentState.slice().sort(
            (a: resultObj, b: resultObj) => {
                if (moment(b.departure).isBefore(a.departure)) {
                    return -1;
                }
                else if (moment(b.departure).isAfter(a.departure)) {
                    return 1;
                }
                else if (moment(b.departure).isSame(a.departure)) {
                    return 0;
                }
            }
        );
    }

    desDeparture(currentState: resultObj[]): resultObj[] {
        return currentState.slice().sort(
            (a: resultObj, b: resultObj) => {
                if (moment(b.departure).isAfter(a.departure)) {
                    return -1;
                }
                else if (moment(b.departure).isBefore(a.departure)) {
                    return 1;
                }
                else if (moment(b.departure).isSame(a.departure)) {
                    return 0;
                }
            }
        );
    }

    ascArrival(currentState: resultObj[]): resultObj[] {
        return currentState.slice().sort(
            (a: resultObj, b: resultObj) => {
                if (moment(b.arrival).isBefore(a.arrival)) {
                    return -1;
                }
                else if (moment(b.arrival).isAfter(a.arrival)) {
                    return 1;
                }
                else if (moment(b.arrival).isSame(a.arrival)) {
                    return 0;
                }
            }
        );
    }

    desArrival(currentState: resultObj[]): resultObj[] {
        return currentState.slice().sort(
            (a: resultObj, b: resultObj) => {
                if (moment(b.arrival).isAfter(a.arrival)) {
                    return -1;
                }
                else if (moment(b.arrival).isBefore(a.arrival)) {
                    return 1;
                }
                else if (moment(b.arrival).isSame(a.arrival)) {
                    return 0;
                }
            }
        );
    }

    ascPrice(currentState: resultObj[]): resultObj[] {
        return currentState.slice().sort(
            (a: resultObj, b: resultObj) => {
                if (b.fare < a.fare) {
                    return -1;
                }
                else if (b.fare > a.fare) {
                    return 1;
                }
                return 0;
            }
        );
    }

    desPrice(currentState: resultObj[]): resultObj[] {
        return currentState.slice().sort(
            (a: resultObj, b: resultObj) => {
                if (b.fare > a.fare) {
                    return -1;
                }
                else if (b.fare < a.fare) {
                    return 1;
                }
                return 0;
            }
        );
    }
}