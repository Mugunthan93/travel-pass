import { flightResult, flightData } from 'src/app/models/search/flight';
import { bookObj, sendRequest, passenger_details } from '../flight.state';
import * as moment from 'moment';
import { Store } from '@ngxs/store';
import { CompanyState } from '../../company.state';
import { OneWaySearchState } from '../../search/flight/oneway.state';
import { UserState } from '../../user.state';


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

    request(data: flightResult): sendRequest {
        let request: sendRequest = null;

        request.managers = this.store.selectSnapshot(UserState.getApprover);
        request.approval_mail_cc = [];
        request.purpose = null
        request.comments = null
        
        request.booking_mode = "online"
        request.status = "pending"
        request.trip_type = "business";
        request.transaction_id = null
        request.customer_id = this.store.selectSnapshot(UserState.getcompanyId);
        request.travel_date = this.store.selectSnapshot(OneWaySearchState.getTravelDate);
        request.traveller_id = this.store.selectSnapshot(UserState.getUserId);
        request.user_id = this.store.selectSnapshot(UserState.getUserId)
        
        request.vendor_id = 153;

        request.passenger_details = this.getPassengerDetails(data)
        request.trip_requests = this.store.selectSnapshot(OneWaySearchState.getTripRequest);

        return request;
    }

    getPassengerDetails(data: flightResult) : passenger_details {
        let passenger: passenger_details = null;

        passenger.country_flag = this.store.selectSnapshot(OneWaySearchState.getTripType) == 'domestic' ? "0" : "1";
        passenger.published_fare = data.Fare.PublishedFare
        passenger.user_eligibility = { msg: null, company_type: "corporate" }
        
        passenger.flight_details = null


        passenger.fare_response = {
            cancellation_risk: null,
            charges_details: {
                GST_total: 0,
                agency_markup: 0,
                cgst_Charges: this.GST().cgst,
                sgst_Charges: this.GST().sgst,
                igst_Charges: this.GST().igst,
                service_charges: this.serviceCharges(),
                total_amount: (
                    data.Fare.PublishedFare - (data.FareBreakdown[0].TaxBreakUp[0].value - data.Fare.OtherCharges) +
                    (this.markupCharges() * data.Fare.PublishedFare) +
                    data.Fare.TaxBreakup[0].value +
                    data.Fare.OtherCharges +
                    this.serviceCharges() +
                    this.GST().sgst +
                    this.GST().cgst +
                    this.GST().igst),
                cgst_onward: 0,
                sgst_onward: 0,
                igst_onward: 0,
                sgst_return: 0,
                cgst_return: 0,
                igst_return: 0,
                onward_markup: 0,
                return_markup: 0,
                markup_charges: 0,
                other_taxes: 0,
                vendor: {
                    service_charges: 0,
                    GST: 0
                }
            },
            onwardfare: [
                [
                    {
                        FareBasisCode: data.FareRules[0].FareBasisCode,
                        IsPriceChanged: false,
                        PassengerCount: data.FareBreakdown[0].PassengerCount,
                        PassengerType: data.FareBreakdown[0].PassengerCount,
                        basefare: data.FareBreakdown[0].BaseFare,
                        details: {
                            AdditionalTxnFeeOfrd: 0,
                            AdditionalTxnFeePub: 0,
                            BaseFare: data.FareBreakdown[0].BaseFare,
                            PassengerCount: data.FareBreakdown[0].PassengerCount,
                            PassengerType: data.FareBreakdown[0].PassengerCount,
                            Tax: data.Fare.Tax,
                            TransactionFee: 0,
                            YQTax: data.Fare.TaxBreakup[1].value
                        },
                        tax: data.Fare.Tax,
                        total_amount: data.Fare.PublishedFare,
                        yqtax: data.Fare.TaxBreakup[1].value
                    }
                ]
            ],
            published_fare: data.Fare.PublishedFare
        }
        passenger.kioskRequest = null,
        // {
        //     adultsType: this.store.selectSnapshot(OneWaySearchState.getAdult),
        //     childsType: 0,
        //     infantsType: 0,
        //     countryFlag: this.store.selectSnapshot(OneWaySearchState.getTripType) == 'domestic' ? "0" : "1",
        //     fromValue: { airportCode: "MAA", airportName: "Chennai", cityName: "Chennai", cityCode: "MAA", countryCode: "IN", … }
        //     onwardDate: "2020-11-18T00:00:00"
        //     returnDate: 0
        //     toValue: { airportCode: "BLR", airportName: "Bengaluru Intl", cityName: "Bangalore", cityCode: "BLR", … }
        //     tour: "1"
        //     travelType: 2
        //     travelType2: 2
        //     trip_mode: 1
        // }
        passenger.passenger = []
        passenger.uapi_params = null
        
        return passenger;
    }
}