import * as _ from "lodash";

export function callingSSR(fareResponse: any) {

        if (fareResponse && this.flightRequestData.JourneyType) {

            if (this.sortedFlightDetails.IsLCC) {
                //getting SSR

                let ssrRequest = {
                    "TraceId": fareResponse.TraceId,
                    "ResultIndex": this.selectedFlight.ResultIndex
                }

                this.service.getSSRvalues(ssrRequest).subscribe(
                    (ssrResponse: any) => {

                    //console.log(ssrResponse);
                    if (ssrResponse && ssrResponse.response) ssrResponse = ssrResponse;//prod-leg optimized

                    else if (ssrResponse && ssrResponse.data) ssrResponse = ssrResponse.data;//dev

                    if (ssrResponse.response && ssrResponse.response.ResponseStatus && ssrResponse.response.ResponseStatus == 1) {

                        this.ssrValues = ssrResponse.response;
                        if (this.sortedFlightDetails.IsLCC == false) {

                            //if lcc false                            
                            if (this.countryFlag == 0) {
                                // console.log('domes')

                                if (this.ssrValues.Meal && this.ssrValues.Meal.length > 1) {
                                    this.formatMeals(this.ssrValues.Meal, 0)
                                }
                                if (this.ssrValues.Baggage && this.ssrValues.Baggage.length > 1) {
                                    this.formatBaggage(this.ssrValues.Baggage, 0)
                                }

                                // if (this.ssrValues.SeatPreference) {
                                //     this.seatValue = this.ssrValues.SeatPreference;
                                // }
                            }
                            else {

                                //intl
                                // console.log('intl')
                                if (this.journeyLength == 1) {

                                    // console.log('1way')
                                    if (this.ssrValues.Meal && this.ssrValues.Meal.length > 1) {
                                        this.formatMeals(this.ssrValues.Meal, 0)
                                    }

                                    if (this.ssrValues.Baggage && this.ssrValues.Baggage.length > 1) {
                                        this.formatBaggage(this.ssrValues.Baggage, 0)
                                    }

                                    // if (this.ssrValues.SeatPreference) {
                                    //     this.seatValue = this.ssrValues.SeatPreference;
                                    // }
                                }
                                else {

                                    //return
                                    // console.log('intl 2way')
                                    //set for 1st leg

                                    if (this.ssrValues.Meal || this.ssrValues.SeatPreference || this.ssrValues.Baggage) {

                                        if (this.ssrValues && this.ssrValues.Meal && this.ssrValues.Meal.length > 1) {
                                            this.formatMeals(this.ssrValues.Meal, 0)
                                        }

                                        // if (this.ssrValues.SeatPreference && this.ssrValues.SeatPreference.length != 0) {
                                        //     this.seatValue = this.ssrValues.SeatPreference;
                                        // }

                                        if (this.ssrValues.Baggage && this.ssrValues.Baggage.length > 1) {
                                            this.formatBaggage(this.ssrValues.Baggage, 0)
                                        }

                                        //2nd leg
                                        this.returnSSRValues = ssrResponse.response;
                                        //reuse for return lcc
                                        this.sortedReturnFlightDetails = {};
                                        this.sortedReturnFlightDetails.IsLCC;
                                        this.sortedReturnFlightDetails.IsLCC = this.sortedFlightDetails.IsLCC;

                                        // console.log(this.sortedReturnFlightDetails.IsLCC)
                                        if (this.returnSSRValues.Meal && this.returnSSRValues.Meal.length > 1) {
                                            this.formatMeals(this.returnSSRValues.Meal, 1)
                                        }
                                        // this.returnseatValue = this.returnSSRValues.SeatPreference;
                                        if (this.returnSSRValues.Baggage && this.returnSSRValues.Baggage.length > 1) {
                                            this.formatBaggage(this.returnSSRValues.Baggage, 1)
                                        }

                                    }
                                    //set for return leg template
                                }
                            }
                        }
                        else {

                            //lcc true
                            // console.log('lcc true')                           
                            if (this.countryFlag == 0) {

                                //domes
                                if (this.ssrValues && (this.ssrValues.MealDynamic || this.ssrValues.SeatDynamic || this.ssrValues.Baggage)) {

                                    if (this.ssrValues.MealDynamic && this.ssrValues.MealDynamic[0].length > 1) {
                                        this.formatMeals(this.ssrValues.MealDynamic[0], 0)
                                    }

                                    // if (this.ssrValues.SeatDynamic && this.ssrValues.SeatDynamic[0].SegmentSeat[0].RowSeats.length != 0) {
                                    //     this.seatValue = this.ssrValues.SeatDynamic[0].SegmentSeat;
                                    // }

                                    if (this.ssrValues.Baggage && this.ssrValues.Baggage[0].length > 1) {
                                        this.formatBaggage(this.ssrValues.Baggage[0], 0)
                                    }
                                }
                                //
                            }
                            else {

                                // console.log('intl')
                                //intl
                                if (this.journeyLength == 1) {

                                    // console.log('1 way')
                                    if (this.ssrValues && (this.ssrValues.MealDynamic || this.ssrValues.SeatDynamic || this.ssrValues.Baggage)) {

                                        if (this.ssrValues.MealDynamic && this.ssrValues.MealDynamic[0].length > 1) {
                                            this.formatMeals(this.ssrValues.MealDynamic[0], 0)
                                        }

                                        // if (this.ssrValues.SeatDynamic && this.ssrValues.SeatDynamic[0].SegmentSeat[0].RowSeats.length != 0) {
                                        //     this.seatValue = this.ssrValues.SeatDynamic[0].SegmentSeat[0].RowSeats;
                                        // }

                                        if (this.ssrValues.Baggage && this.ssrValues.Baggage[0].length > 1) {
                                            // this.baggageValue = this.ssrValues.Baggage[0];
                                            this.formatBaggage(this.ssrValues.Baggage[0], 0)
                                        }
                                    }
                                }
                                else if (this.journeyLength == 2) {

                                    // console.log('2way')
                                    //return
                                    //reuse for return lcc true
                                    this.sortedReturnFlightDetails = {};
                                    this.sortedReturnFlightDetails.IsLCC;
                                    this.sortedReturnFlightDetails.IsLCC = this.sortedFlightDetails.IsLCC;

                                    // console.log(this.ssrValues)
                                    //set for 1st leg
                                    if (this.ssrValues && (this.ssrValues.MealDynamic || this.ssrValues.SeatDynamic || this.ssrValues.Baggage[0])) {

                                        if (this.ssrValues.MealDynamic && this.ssrValues.MealDynamic[0].length > 1) {
                                            this.formatMeals(this.ssrValues.MealDynamic[0], 0)
                                        }

                                        // if (this.ssrValues.SeatDynamic && this.ssrValues.SeatDynamic[0].SegmentSeat[0].RowSeats.length != 0) {
                                        //     this.seatValue = this.ssrValues.SeatDynamic[0].SegmentSeat[0].RowSeats;
                                        // }

                                        if (this.ssrValues.Baggage && this.ssrValues.Baggage[0].length > 1) {
                                            this.formatBaggage(this.ssrValues.Baggage[0], 0)
                                        }
                                    }

                                    //set for return leg template
                                    this.returnSSRValues = ssrResponse.response;
                                    if (this.returnSSRValues) {
                                        if (this.returnSSRValues.MealDynamic && this.returnSSRValues.MealDynamic[1]) {

                                            if (this.returnSSRValues.MealDynamic[1] && this.returnSSRValues.MealDynamic[1].length > 1) {
                                                this.formatMeals(this.returnSSRValues.MealDynamic[1], 1)
                                            }
                                        }

                                        // if (this.returnSSRValues.SeatDynamic && this.returnSSRValues.SeatDynamic[1] && this.returnSSRValues.SeatDynamic[1].SegmentSeat[0].RowSeats) {
                                        //     if (this.returnSSRValues.SeatDynamic[1] && this.returnSSRValues.SeatDynamic[1].SegmentSeat[0].RowSeats.length != 0) {
                                        //         this.returnseatValue = this.ssrValues.SeatDynamic[1].SegmentSeat[0].RowSeats;
                                        //     }
                                        // }

                                        if (this.returnSSRValues.Baggage && this.returnSSRValues.Baggage[1]) {
                                            if (this.returnSSRValues.Baggage[1] && this.returnSSRValues.Baggage[1].length > 1) {
                                                this.formatBaggage(this.returnSSRValues.Baggage[1], 1)
                                            }
                                        }
                                    }

                                    //after finish ssr
                                    // console.log(this.returnbaggageValue)
                                }
                            }
                        }

                        this.calcNettotal()
                    }
                    //response ==1 success
                    else {

                        // console.log("Err Message:", ssrResponse.response.Error.ErrorMessage);
                        this.errorPriority = "Low";
                        let errortype = "Information";
                        this.srcMessages = this.selectedFlight.Segments[0][0].Origin.Airport.CityName;
                        this.dstMessages = this.selectedFlight.Segments[0][0].Destination.Airport.CityName;
                        this.errorMessages = ssrResponse.response.Error.ErrorMessage;
                        this.saveLogs(this.errorMessages, this.srcMessages, this.dstMessages, this.errorPriority, errortype);

                        // this.formUAPI();
                        this.calcNettotal()
                    }
                    }, 
                    (error) => {
                        console.log(error);
                        // ssr failed
                        // if (this.countryFlag == 0 && this.flightRequestData.JourneyType == 1) {
                        //     this.formUAPI();
                        // }
                        // else {
                        //     console.log(this.flightRequestData)
                        //     this.calcNettotal()

                        // }

                        console.log("Err Message:ssr failed");
                        this.errorPriority = "Low";
                        let errortype = "Information";
                        this.srcMessages = this.selectedFlight.Segments[0][0].Origin.Airport.CityName;
                        this.dstMessages = this.selectedFlight.Segments[0][0].Destination.Airport.CityName;
                        this.errorMessages = 'SSR Failed.';
                        this.saveLogs(this.errorMessages, this.srcMessages, this.dstMessages, this.errorPriority, errortype);
                        // this.formUAPI();
                        this.calcNettotal()
                    });
            }

            else {
                // ssr not called as of now
                // this.formUAPI()//only multi trip 
                this.calcNettotal()
            }

        }

}

export function formatBaggage(bagVal: any, type: number) {

        if (bagVal) {
            // console.log(this.passengerDetails)
            let segment: any = []
            if (type == 0) {
                segment = JSON.parse(JSON.stringify(this.sortedFlightDetails.Segments[0]))
            } else {
                // return 
                if (this.journeyLength == 2 && this.countryFlag == 0) {
                    segment = JSON.parse(JSON.stringify(this.sortedReturnFlightDetails.Segments[0]))
                }
                if (this.journeyLength == 2 && this.countryFlag == 1) {
                    segment = JSON.parse(JSON.stringify(this.sortedFlightDetails.Segments[1]))
                }
            }
            let sectorBag: any = []
            let sindex: any = 0;
            for (let a of segment) {
                let mIndex: any = _.filter(bagVal, function (item: any) {
                    let item_Price: any = '';
                    if (item.Weight == 0 && item.code == 'No Baggage') {
                        item.option_label = 'Select Baggage';
                    }
                    else {
                        item_Price = "-" + item.Price + " INR";
                        item.option_label = item.Weight + "KG" + item_Price;
                    }
                    return (item.Origin == a.Origin.Airport.CityCode) && (item.Destination == a.Destination.Airport.CityCode) && (item.FlightNumber == a.Airline.FlightNumber);
                })
                if (mIndex.length > 0) {
                    sectorBag.push(mIndex)
                }
                sindex++;
            }
            // console.log(sectorBag)
            if (sectorBag.length > 0) {
                // if sector wise baggage found  
                if (type == 0) {
                    this.baggageValue = JSON.parse(JSON.stringify(sectorBag));
                    let sindex: any = 0;
                    for (let s of sectorBag) {
                        for (let a of this.passengerDetails) {
                            a.onwardExtraServices.Baggage.push(sectorBag[0][0]);
                        }
                        sindex++;
                    }
                } else {
                    this.returnbaggageValue = JSON.parse(JSON.stringify(sectorBag));
                    let sindex: any = 0;
                    for (let s of sectorBag) {
                        for (let a of this.passengerDetails) {
                            a.returnExtraServices.Baggage.push(sectorBag[0][0]);
                        }
                        sindex++;
                    }
                }
                // console.log(this.baggageValue)
            }
            else if (sectorBag.length == 0) {
                // if meals not found sector-wise meals
                // then only one array comes 
                // we guess one array (origin to destination) 
                if (type == 0) {
                    this.baggageValue.push(bagVal);
                }
                else {
                    // return
                    this.returnbaggageValue.push(bagVal);

                }
            }

        }
}

export function formatMeals(mealVal: any, type: number) {
    //  console.log(mealVal,type)
    let isSMEFare: boolean = false;
    let fareResult: any;
    if (mealVal) {
        if (type == 0 || type == 1) {
            let segment: any = []
            if (type == 0) {
                segment = JSON.parse(JSON.stringify(this.sortedFlightDetails.Segments[0]))
                fareResult = JSON.parse(JSON.stringify(this.sortedFlightDetails))
            } else {
                // return 
                if (this.journeyLength == 2 && this.countryFlag == 0) {
                    segment = JSON.parse(JSON.stringify(this.sortedReturnFlightDetails.Segments[0]))
                    fareResult = JSON.parse(JSON.stringify(this.sortedReturnFlightDetails))
                }
                if ((this.journeyLength == 2 || this.journeyLength == 3) && this.countryFlag == 1) {
                    segment = JSON.parse(JSON.stringify(this.sortedFlightDetails.Segments[1]))
                    fareResult = JSON.parse(JSON.stringify(this.sortedFlightDetails))
                }
            }
            if ((_.includes(fareResult.AirlineRemark, 'SME') == true) || (_.includes(fareResult.AirlineRemark, 'sme') == true)) {
                isSMEFare = true;
                this.isSMEFare = true;
            }
            let sectorMeals: any = []
            let sindex: any = 0;
            // console.log(segment)
            for (let a of segment) {
                let mIndex: any = _.filter(mealVal, function (item: any) {
                    let item_Price: any = '';
                    if (_.toLower(item.Code) == 'no meal' || _.includes(item.Code, 'No Meal') == true) {
                        item.option_label = "Select Meal";
                    }
                    else {
                        item_Price = "-" + item.Price + " INR";
                        item.option_label = item.AirlineDescription + item_Price;
                    }
                    return (item.Origin == a.Origin.Airport.CityCode) && (item.Destination == a.Destination.Airport.CityCode) && (item.FlightNumber == a.Airline.FlightNumber);
                })
                if (mIndex.length > 0) {
                    sectorMeals.push(mIndex)
                }
                sindex++;
            }
            // console.log(sectorMeals)
            if (sectorMeals.length > 0) {
                // if sector wise meals found  
                if (type == 0) {
                    this.mealsValue = JSON.parse(JSON.stringify(sectorMeals));
                    let sindex: any = 0;
                    for (let s of sectorMeals) {
                        for (let a of this.passengerDetails) {
                            if (a.PaxType != 3 && isSMEFare == true) {
                                let that = this;
                                a.onwardExtraServices.Meal = _.filter(mealVal, function (obj: any) {
                                    let labelval: any = _.toLower(obj.AirlineDescription);
                                    // console.log(labelval)
                                    // console.log(_.includes(labelval,'corp'))
                                    return labelval == 'corporate' || (_.includes(labelval, 'corp') == true)
                                })
                            }
                            else {
                                a.onwardExtraServices.Meal.push(sectorMeals[0][0])
                            }
                        }
                        sindex++;
                    }
                    // console.log(this.mealsValue)
                }
                else {
                    // return
                    this.returnmealsValue = JSON.parse(JSON.stringify(sectorMeals));
                    let sindex: any = 0;
                    for (let s of sectorMeals) {
                        for (let a of this.passengerDetails) {
                            if (a.PaxType != 3 && isSMEFare == true) {
                                let that = this;
                                a.returnExtraServices.Meal = _.filter(mealVal, function (obj: any) {
                                    let labelval: any = _.toLower(obj.AirlineDescription);
                                    // console.log(labelval)
                                    // console.log(_.includes(labelval,'corp'))
                                    return labelval == 'corporate' || (_.includes(labelval, 'corp') == true)
                                })
                            }
                            else {
                                a.returnExtraServices.Meal.push(sectorMeals[0][0]);
                            }
                        }
                        sindex++;
                    }
                }
            }
            else if (sectorMeals.length == 0) {
                // if meals not found sector-wise meals
                // then only one array comes 
                // we guess one array (origin to destination) 
                if (type == 0) {
                    this.mealsValue.push(mealVal);
                    for (let a of this.passengerDetails) {
                        if (a.PaxType != 3 && isSMEFare == true) {
                            let that = this;
                            a.onwardExtraServices.Meal = _.filter(mealVal, function (obj: any) {
                                let labelval: any = _.toLower(obj.AirlineDescription);
                                // console.log(labelval)
                                // console.log(_.includes(labelval,'corp'))
                                return labelval == 'corporate' || (_.includes(labelval, 'corp') == true)
                            })
                        }

                    }

                }
                else {
                    // return
                    this.returnmealsValue.push(mealVal);
                    for (let a of this.passengerDetails) {
                        if (a.PaxType != 3 && isSMEFare == true) {
                            let that = this;
                            a.returnExtraServices.Meal = _.filter(mealVal, function (obj: any) {
                                let labelval: any = _.toLower(obj.AirlineDescription);
                                // console.log(labelval)
                                // console.log(_.includes(labelval,'corp'))
                                return labelval == 'corporate' || (_.includes(labelval, 'corp') == true)
                            })
                        }
                    }
                }
            }
            // console.log(type, this.mealsValue)
            // console.log(type, this.returnmealsValue)
            // console.log(this.passengerDetails)
        }
    }
}