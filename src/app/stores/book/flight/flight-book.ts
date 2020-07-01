import { flightResult, flightData } from 'src/app/models/search/flight';
import { bookObj } from '../flight.state';
import * as moment from 'moment';
import { Store } from '@ngxs/store';
import { CompanyState } from '../../company.state';
import { OneWaySearchState } from '../../search/flight/oneway.state';


export interface GST {
    cgst: number,
    sgst: number,
    igst: number
}


export class BaseFlightBook {

    constructor(
        public store : Store
    ) {
        
    }

    bookData(data: flightResult): bookObj {

        let book: bookObj = {
            summary: {
                fare: {
                    base: data.Fare.BaseFare,
                    taxes: data.Fare.Tax
                },
                total: {
                    serviceCharge: this.serviceCharges(),
                    SGST: this.GST().sgst,
                    CGST: this.GST().cgst,
                    IGST: this.GST().igst,
                    flight: data.Fare.PublishedFare - (data.FareBreakdown[0].TaxBreakUp[0].value - data.Fare.OtherCharges),
                    k3: data.Fare.TaxBreakup[0].value,
                    other: data.Fare.OtherCharges,
                    extraMeals: null,
                    extraBaggage: null,
                    total: (
                        data.Fare.PublishedFare - (data.FareBreakdown[0].TaxBreakUp[0].value - data.Fare.OtherCharges) +
                        (this.markupCharges() * data.Fare.PublishedFare) + 
                        data.Fare.TaxBreakup[0].value + 
                        data.Fare.OtherCharges + 
                        this.serviceCharges() + 
                        this.GST().sgst +
                        this.GST().cgst +
                        this.GST().igst),
                        currency: data.FareBreakdown[0].Currency
                }

            },
            trip: []
        };

        data.Segments.forEach(
            (element: flightData[], index: number, arr: flightData[][]) => {
                book.trip[index] = {
                    origin: element[index].Origin.Airport.CityName,
                    destination: element[index].Destination.Airport.CityName,
                    connecting_flight: []
                }

                element.forEach(
                    (el: flightData, ind: number, arr: flightData[]) => {

                        book.trip[index].connecting_flight[ind] = {
                            airline: {
                                name: el.Airline.AirlineName,
                                code: el.Airline.AirlineCode,
                                number: el.Airline.FlightNumber
                            },
                            origin: {
                                name: el.Origin.Airport.CityName,
                                code: el.Origin.Airport.CityCode,
                                date: el.Origin.DepTime,
                                terminal: el.Origin.Airport.Terminal
                            },
                            destination: {
                                name: el.Destination.Airport.CityName,
                                code: el.Destination.Airport.CityCode,
                                date: el.Destination.ArrTime,
                                terminal: el.Destination.Airport.Terminal
                            },
                            duration: moment.duration(el.Duration, 'minutes').days() + "d " + moment.duration(el.Duration, 'minutes').hours() + "h " + moment.duration(el.Duration, 'minutes').minutes() + "m"
                        }
                    }
                );
            }
        );

        console.log(book);
        return book;
    }

    serviceCharges() : number {
        let serviceCharge: number = 0;
        if (this.store.selectSnapshot(OneWaySearchState.getTripType) == 'domestic') {
            serviceCharge = this.store.selectSnapshot(CompanyState.getDomesticServiceCharge) * this.store.selectSnapshot(OneWaySearchState.getAdult);
            console.log(serviceCharge);
        }
        else if (this.store.selectSnapshot(OneWaySearchState.getTripType) == 'international') {
            serviceCharge = this.store.selectSnapshot(CompanyState.getInternationalServiceCharge) * this.store.selectSnapshot(OneWaySearchState.getAdult);
            console.log(serviceCharge);
        }
        return serviceCharge;
    }

    GST(): GST {
        if (this.store.selectSnapshot(CompanyState.getStateName) == 'Tamil Nadu') {
            return {
                cgst: (this.serviceCharges() * 9) / 100,
                sgst: (this.serviceCharges() * 9) / 100,
                igst: 0
            }
        }
        else if (this.store.selectSnapshot(CompanyState.getStateName) !== 'Tamil Nadu') {
            return {
                cgst: 0,
                sgst: 0,
                igst: (this.serviceCharges() * 18) / 100
            } 
        }
    }

    markupCharges() : number {
        let markupCharge: number = 0;
        if (this.store.selectSnapshot(OneWaySearchState.getTripType) == 'domestic') {
            markupCharge = this.store.selectSnapshot(CompanyState.getDomesticMarkupCharge) / 100;
            console.log(markupCharge);
        }
        else if (this.store.selectSnapshot(OneWaySearchState.getTripType) == 'international') {
            markupCharge = this.store.selectSnapshot(CompanyState.getInternationalMarkupCharge) / 100;
            console.log(markupCharge);
        }
        return parseInt(markupCharge.toFixed(2));
    }
}