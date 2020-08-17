import { flightResult, flightData } from 'src/app/models/search/flight';
import { itinerarytrip, emailtrip, resultObj, trips, baggage, fareRule } from '../flight.state';
import * as moment from 'moment';
import * as _ from 'lodash';

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
            corporate : _.isNull(result.AirlineRemark) ? false : true,
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

    getCabinClass(cls: number) : string {
        let cabinclass : string = null;
        switch (cls) {
            case 1: cabinclass = "All"; break;
            case 2: cabinclass = "economy"; break;
            case 3: cabinclass = "premium economy"; break;
            case 4: cabinclass = "bussiness"; break;
            case 6: cabinclass = "first class"; break;
            default: cabinclass = "All";  break;
        }
        return cabinclass;
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
}