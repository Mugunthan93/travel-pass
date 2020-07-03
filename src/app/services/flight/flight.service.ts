import { Injectable } from '@angular/core';
import { NativeHttpService } from '../http/native-http/native-http.service';
import { flightSearchPayload, metrixBoard } from 'src/app/models/search/flight';
import { HTTPResponse, HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
import { fareRule } from '../../stores/result/flight.state';
import { itineraryPayload } from 'src/app/components/flight/email-itinerary/email-itinerary.component';
import { sendRequest, rt_sendRequest, int_sendRequest } from 'src/app/stores/book/flight.state';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor(
    private http: NativeHttpService
  ) { }
  
  async metrixboard(metrixData: metrixBoard) {
    return await this.http.post("/metrixdashboard", metrixData);
  }

  async searchFlight(searchData: flightSearchPayload): Promise<HTTPResponse> {
    this.http.setHeader(environment.baseURL, "Content-Type", "application/json");
    this.http.setData('json');
    return await this.http.post("/airlines/search", searchData);
  }

  async fairRule(fareRule: fareRule): Promise<HTTPResponse> {
    return await this.http.post("/airlines/airlineFareRule", fareRule);
  }

  async emailItinerary(itinerary: itineraryPayload): Promise<HTTPResponse> {
    return await this.http.post("/emailTemplate/", itinerary);
  }

  async agencyBalance(): Promise<HTTPResponse> {
    return await this.http.get("/airlines/agencyBalance",{});
  }

  async fairQuote(trace : fareRule): Promise<HTTPResponse> {
    return await this.http.post("/airlines/airlineFareQuote", trace);
  }

  async SSR(trace: fareRule): Promise<HTTPResponse> {
    return await this.http.post("/airlines/airlineSSR", trace);
  }

  //send req by user - one-way
  async sendRequest(request: sendRequest): Promise<HTTPResponse> {
    return await this.http.post("/airlineRequest?email_notify=true", request);
  }

  //send req by user - round-trip
  async rtSendRequest(request: rt_sendRequest): Promise<HTTPResponse> {
    return await this.http.post("/airlineRequest?email_notify=true", request);
  }

  //send req by user - round-trip
  async intSendRequest(request: int_sendRequest): Promise<HTTPResponse> {
    return await this.http.post("/airlineRequest?email_notify=true", request);
  }

  //get ticket by manager from approval request list 
  async getReqTicket(ticketId: string): Promise<HTTPResponse> {
    const encrytkey = {
      "encrytkey": "wMMtGeHb0WCq9oppu3n6Apvco0Bt6zaT0sJVwsSXlxM="
    }
    return await this.http.get("/airlineRequest/" + ticketId, encrytkey);
  }

  //approve the request
  async approvalReq(ticketId : string, requestBody : any ): Promise<HTTPResponse> {
    return await this.http.put("/airlineRequest" + ticketId, requestBody);
  }

  //my booking - new
  async openBooking(userId: number): Promise<HTTPResponse> {
    
    const startDate = moment().format('YYYY-MM-DD%2023:59:59.000+00:00');
    const endDate = moment().subtract(7, "days").format('YYYY-MM-DD%2000:00:01.000+00:00'); 
    const book = {
      "booking_mode": "online"
    }
    
    return await this.http.get("/airlineRequest/getairlinebyuserid/" + userId.toString() + "/open/" + endDate + "/" + startDate + "/0/999", book);
  }

  //my booking - new, history
  async pendingBooking(userId: number): Promise<HTTPResponse> {

    const startDate = moment().format('YYYY-MM-DD%2023:59:59.000+00:00');
    const endDate = moment().subtract(7, "days").format('YYYY-MM-DD%2000:00:01.000+00:00'); 
    const book = {
      "booking_mode": "online"
    }

    return await this.http.get("/airlineRequest/getairlinebyuserid/" + userId.toString() + "/pending/" + endDate + "/" + startDate + "/0/999", book);
  }

  // approver reqest list
  async approvalReqList(userId: number): Promise<HTTPResponse> {
    return await this.http.get("/allBookings/" + userId, {});
  }




  // list booking
  // https://api.dev.travellerspass.com/V1.0/allBookings/489

  // click approve from list
  // https://api.dev.travellerspass.com/V1.0/airlineRequest/2503?encrytkey=wMMtGeHb0WCq9oppu3n6Apvco0Bt6zaT0sJVwsSXlxM=

  // click approve from selected ticket
  // https://api.dev.travellerspass.com/V1.0/airlineRequest/2503

  //body of accepting approve
  acceptapprovebody: any = {
    "passenger_details": {
      "passenger": [
        {
          "City": "Chennai",
          "Fare": {
            "Tax": 1110,
            "YQTax": 350,
            "BaseFare": 6670,
            "PassengerType": 1,
            "PassengerCount": 1,
            "TransactionFee": 0,
            "AdditionalTxnFeePub": 0,
            "AdditionalTxnFeeOfrd": 0
          },
          "Email": "mari@tripmidas.com",
          "Title": "Mr",
          "Gender": 1,
          "PaxType": 1,
          "LastName": "Durai",
          "ContactNo": "1234567890",
          "FirstName": "Mari",
          "GSTNumber": "32AABCK7612C1Z4",
          "IsLeadPax": true,
          "PassportNo": "M8787898",
          "CountryCode": "IN",
          "CountryName": "India",
          "DateOfBirth": "1944-02-10T00:00:00.000Z",
          "AddressLine1": "egmore",
          "GSTCompanyName": "Expense Test DP",
          "PassportExpiry": "2030-02-08T00:00:00.000Z",
          "GSTCompanyEmail": "hgsa@gmail.com",
          "GSTCompanyAddress": "GM nagar,: 1090, A.R. Complex, 1.A, Poonamallee High Road, Vepery High Rd, Periyamet, Chennai, Tamil Nadu 600007",
          "onwardExtraServices": {
            "Meal": [],
            "Baggage": [],
            "BagTotal": 0,
            "MealTotal": 0
          },
          "returnExtraServices": {
            "Meal": [],
            "Baggage": [],
            "BagTotal": 0,
            "MealTotal": 0
          },
          "GSTCompanyContactNumber": "1234567890"
        }
      ],
      "uapi_params": {
        "selected_plb_Value": {
          "K3": 354,
          "PCC": 0,
          "vendor_id": 153,
          "PLB_earned": 0,
          "queuenumber": 0,
          "consolidator_name": "ONLINE FARE"
        },
        "selected_Return_plb_Value": ""
      },
      "country_flag": "1",
      "kioskRequest": {
        "tour": "1",
        "toValue": {
          "cityCode": "DXB",
          "cityName": "Dubai",
          "currency": "AED  ",
          "nationalty": "Emirati",
          "airportCode": "XNB",
          "airportName": "Dubai Bus Station",
          "countryCode": "AE",
          "countryName": "United Arab Emirates"
        },
        "fromValue": {
          "cityCode": "MAA",
          "cityName": "Chennai",
          "currency": "INR  ",
          "nationalty": "Indian",
          "airportCode": "MAA",
          "airportName": "Chennai",
          "countryCode": "IN",
          "countryName": "India"
        },
        "trip_mode": 1,
        "adultsType": 1,
        "childsType": 0,
        "onwardDate": "2020-02-18T00:00:00",
        "returnDate": 0,
        "travelType": 2,
        "countryFlag": 1,
        "infantsType": 0,
        "travelType2": 2
      },
      "fare_response": {
        "onwardfare": [
          [
            {
              "tax": 1110,
              "yqtax": 350,
              "details": {
                "Tax": 1110,
                "YQTax": 350,
                "BaseFare": 6670,
                "PassengerType": 1,
                "PassengerCount": 1,
                "TransactionFee": 0,
                "AdditionalTxnFeePub": 0,
                "AdditionalTxnFeeOfrd": 0
              },
              "basefare": 6670,
              "total_amount": 7909.8,
              "FareBasisCode": "USAVER",
              "PassengerType": 1,
              "IsPriceChanged": true,
              "PassengerCount": 1
            }
          ]
        ],
        "published_fare": 8145.8,
        "charges_details": {
          "GST_total": 0,
          "cgst_onward": 0,
          "cgst_return": 0,
          "igst_onward": 0,
          "igst_return": 0,
          "other_taxes": 0,
          "sgst_onward": 0,
          "sgst_return": 0,
          "cgst_Charges": 18,
          "igst_Charges": 0,
          "sgst_Charges": 18,
          "total_amount": 8145.8,
          "agency_markup": 0,
          "onward_markup": 0,
          "return_markup": 0,
          "markup_charges": 0,
          "service_charges": 200
        },
        "cancellation_risk": "25-50"
      },
      "flight_details": [
        {
          "Fare": {
            "Tax": 1110,
            "YQTax": 350,
            "BaseFare": 6670,
            "ChargeBU": [
              {
                "key": "TBOMARKUP",
                "value": 0
              },
              {
                "key": "CONVENIENCECHARGE",
                "value": 0
              },
              {
                "key": "OTHERCHARGE",
                "value": 129.8
              }
            ],
            "Currency": "INR",
            "Discount": 0,
            "PGCharge": 0,
            "TdsOnPLB": 0,
            "PLBEarned": 0,
            "ServiceFee": 0,
            "TaxBreakup": [
              {
                "key": "K3",
                "value": 354
              },
              {
                "key": "YQTax",
                "value": 350
              },
              {
                "key": "YR",
                "value": 50
              },
              {
                "key": "PSF",
                "value": 0
              },
              {
                "key": "UDF",
                "value": 82
              },
              {
                "key": "INTax",
                "value": 0
              },
              {
                "key": "TransactionFee",
                "value": 0
              },
              {
                "key": "OtherTaxes",
                "value": 774
              }
            ],
            "OfferedFare": 7909.8,
            "OtherCharges": 129.8,
            "PublishedFare": 7909.8,
            "TdsOnIncentive": 0,
            "IncentiveEarned": 0,
            "TdsOnCommission": 0,
            "CommissionEarned": 0,
            "TotalMealCharges": 0,
            "TotalSeatCharges": 0,
            "AdditionalTxnFeePub": 0,
            "TotalBaggageCharges": 0,
            "AdditionalTxnFeeOfrd": 0,
            "TotalSpecialServiceCharges": 0
          },
          "IsLCC": true,
          "Source": 3,
          "Segments": [
            [
              {
                "Mile": 0,
                "Craft": "737",
                "Origin": {
                  "Airport": {
                    "CityCode": "MAA",
                    "CityName": "Chennai",
                    "Terminal": "1",
                    "AirportCode": "MAA",
                    "AirportName": "Chennai",
                    "CountryCode": "IN",
                    "CountryName": "India"
                  },
                  "DepTime": "2020-02-18T12:30:00"
                },
                "Remark": null,
                "Status": "",
                "Airline": {
                  "FareClass": "U",
                  "AirlineCode": "SG",
                  "AirlineName": "SpiceJet",
                  "FlightNumber": "502",
                  "OperatingCarrier": ""
                },
                "Baggage": "30 KG",
                "Duration": 155,
                "StopOver": false,
                "StopPoint": "",
                "GroundTime": 0,
                "Destination": {
                  "Airport": {
                    "CityCode": "AMD",
                    "CityName": "Ahmedabad",
                    "Terminal": "1",
                    "AirportCode": "AMD",
                    "AirportName": "Ahmedabad",
                    "CountryCode": "IN",
                    "CountryName": "India"
                  },
                  "ArrTime": "2020-02-18T15:05:00"
                },
                "CabinBaggage": "7 KG",
                "FlightStatus": "Confirmed",
                "TripIndicator": 1,
                "FlightInfoIndex": "",
                "SegmentIndicator": 1,
                "IsETicketEligible": true,
                "StopPointArrivalTime": "0001-01-01T00:00:00",
                "StopPointDepartureTime": "0001-01-01T00:00:00"
              },
              {
                "Mile": 0,
                "Craft": "737",
                "Origin": {
                  "Airport": {
                    "CityCode": "AMD",
                    "CityName": "Ahmedabad",
                    "Terminal": "2",
                    "AirportCode": "AMD",
                    "AirportName": "Ahmedabad",
                    "CountryCode": "IN",
                    "CountryName": "India"
                  },
                  "DepTime": "2020-02-18T16:35:00"
                },
                "Remark": null,
                "Status": "",
                "Airline": {
                  "FareClass": "U",
                  "AirlineCode": "SG",
                  "AirlineName": "SpiceJet",
                  "FlightNumber": "15",
                  "OperatingCarrier": ""
                },
                "Baggage": "30 KG",
                "Duration": 200,
                "StopOver": false,
                "StopPoint": "",
                "GroundTime": 90,
                "Destination": {
                  "Airport": {
                    "CityCode": "DXB",
                    "CityName": "Dubai",
                    "Terminal": "1",
                    "AirportCode": "DXB",
                    "AirportName": "Dubai",
                    "CountryCode": "AE",
                    "CountryName": "United Arab Emirates"
                  },
                  "ArrTime": "2020-02-18T18:25:00"
                },
                "CabinBaggage": "7 KG",
                "FlightStatus": "Confirmed",
                "TripIndicator": 1,
                "FlightInfoIndex": "",
                "SegmentIndicator": 2,
                "IsETicketEligible": true,
                "AccumulatedDuration": 445,
                "StopPointArrivalTime": "0001-01-01T00:00:00",
                "StopPointDepartureTime": "0001-01-01T00:00:00"
              }
            ]
          ],
          "FareRules": [
            {
              "Origin": "MAA",
              "Airline": "SG",
              "Destination": "AMD",
              "FareBasisCode": "USAVER",
              "FareRuleIndex": "",
              "FareFamilyCode": "",
              "FareRuleDetail": "",
              "FareRestriction": ""
            },
            {
              "Origin": "AMD",
              "Airline": "SG",
              "Destination": "DXB",
              "FareBasisCode": "USAVER",
              "FareRuleIndex": "",
              "FareFamilyCode": "",
              "FareRuleDetail": "",
              "FareRestriction": ""
            }
          ],
          "GSTAllowed": true,
          "AirlineCode": "SG",
          "ResultIndex": "OB4",
          "IsRefundable": true,
          "AirlineRemark": "this is a test from aditya.",
          "FareBreakdown": [
            {
              "Tax": 1110,
              "YQTax": 350,
              "BaseFare": 6670,
              "Currency": "INR",
              "PGCharge": 0,
              "PassengerType": 1,
              "PassengerCount": 1,
              "AdditionalTxnFeePub": 0,
              "AdditionalTxnFeeOfrd": 0
            }
          ],
          "IsGSTMandatory": false,
          "LastTicketDate": null,
          "TicketAdvisory": null,
          "ValidatingAirline": "SG",
          "IsCouponAppilcable": true,
          "IsHoldAllowedWithSSR": true
        }
      ],
      "published_fare": 8145.8,
      "user_eligibility": {
        "msg": null,
        "company_type": "corporate",
        "approverid": "airline"
      },
      "highestFareDetails": {
        "quest": "Cheapest Fare is also available. Please mention the reason why you are choosing the highest Fare.",
        "value": "OB4",
        "reason": "Test",
        "tourtype": "Business",
        "highestFlight": {
          "Fare": {
            "Tax": 1610,
            "YQTax": 350,
            "BaseFare": 6670,
            "ChargeBU": [
              {
                "key": "TBOMARKUP",
                "value": 0
              },
              {
                "key": "CONVENIENCECHARGE",
                "value": 0
              },
              {
                "key": "OTHERCHARGE",
                "value": 129.8
              }
            ],
            "Currency": "INR",
            "Discount": 0,
            "PGCharge": 0,
            "TdsOnPLB": 0,
            "PLBEarned": 0,
            "ServiceFee": 0,
            "TaxBreakup": [
              {
                "key": "K3",
                "value": 354
              },
              {
                "key": "YQTax",
                "value": 350
              },
              {
                "key": "YR",
                "value": 50
              },
              {
                "key": "PSF",
                "value": 0
              },
              {
                "key": "UDF",
                "value": 82
              },
              {
                "key": "INTax",
                "value": 0
              },
              {
                "key": "TransactionFee",
                "value": 0
              },
              {
                "key": "OtherTaxes",
                "value": 774
              }
            ],
            "OfferedFare": 8409.8,
            "OtherCharges": 129.8,
            "PublishedFare": 8409.8,
            "TdsOnIncentive": 0,
            "IncentiveEarned": 0,
            "TdsOnCommission": 0,
            "CommissionEarned": 0,
            "TotalMealCharges": 0,
            "TotalSeatCharges": 0,
            "AdditionalTxnFeePub": 0,
            "TotalBaggageCharges": 0,
            "AdditionalTxnFeeOfrd": 0,
            "TotalSpecialServiceCharges": 0
          },
          "IsLCC": true,
          "Source": 3,
          "Segments": [
            [
              {
                "Mile": 0,
                "Craft": "737",
                "Origin": {
                  "Airport": {
                    "CityCode": "MAA",
                    "CityName": "Chennai",
                    "Terminal": "1",
                    "AirportCode": "MAA",
                    "AirportName": "Chennai",
                    "CountryCode": "IN",
                    "CountryName": "India"
                  },
                  "DepTime": "2020-02-18T12:30:00"
                },
                "Remark": null,
                "Status": "",
                "Airline": {
                  "FareClass": "U",
                  "AirlineCode": "SG",
                  "AirlineName": "SpiceJet",
                  "FlightNumber": "502",
                  "OperatingCarrier": ""
                },
                "Baggage": "30 KG",
                "Duration": 155,
                "StopOver": false,
                "StopPoint": "",
                "GroundTime": 0,
                "Destination": {
                  "Airport": {
                    "CityCode": "AMD",
                    "CityName": "Ahmedabad",
                    "Terminal": "1",
                    "AirportCode": "AMD",
                    "AirportName": "Ahmedabad",
                    "CountryCode": "IN",
                    "CountryName": "India"
                  },
                  "ArrTime": "2020-02-18T15:05:00"
                },
                "CabinBaggage": "7 KG",
                "FlightStatus": "Confirmed",
                "TripIndicator": 1,
                "FlightInfoIndex": "",
                "SegmentIndicator": 1,
                "IsETicketEligible": true,
                "NoOfSeatAvailable": 1,
                "StopPointArrivalTime": null,
                "StopPointDepartureTime": null
              },
              {
                "Mile": 0,
                "Craft": "737",
                "Origin": {
                  "Airport": {
                    "CityCode": "AMD",
                    "CityName": "Ahmedabad",
                    "Terminal": "2",
                    "AirportCode": "AMD",
                    "AirportName": "Ahmedabad",
                    "CountryCode": "IN",
                    "CountryName": "India"
                  },
                  "DepTime": "2020-02-18T16:35:00"
                },
                "Remark": null,
                "Status": "",
                "Airline": {
                  "FareClass": "U",
                  "AirlineCode": "SG",
                  "AirlineName": "SpiceJet",
                  "FlightNumber": "15",
                  "OperatingCarrier": ""
                },
                "Baggage": "30 KG",
                "Duration": 200,
                "StopOver": false,
                "StopPoint": "",
                "GroundTime": 90,
                "Destination": {
                  "Airport": {
                    "CityCode": "DXB",
                    "CityName": "Dubai",
                    "Terminal": "1",
                    "AirportCode": "DXB",
                    "AirportName": "Dubai",
                    "CountryCode": "AE",
                    "CountryName": "United Arab Emirates"
                  },
                  "ArrTime": "2020-02-18T18:25:00"
                },
                "CabinBaggage": "7 KG",
                "FlightStatus": "Confirmed",
                "TripIndicator": 1,
                "FlightInfoIndex": "",
                "SegmentIndicator": 2,
                "IsETicketEligible": true,
                "NoOfSeatAvailable": 1,
                "AccumulatedDuration": 445,
                "StopPointArrivalTime": null,
                "StopPointDepartureTime": null
              }
            ]
          ],
          "FareRules": [
            {
              "Origin": "MAA",
              "Airline": "SG",
              "Destination": "AMD",
              "FareBasisCode": "USAVER",
              "FareRuleIndex": "",
              "FareFamilyCode": "",
              "FareRuleDetail": "",
              "FareRestriction": ""
            },
            {
              "Origin": "AMD",
              "Airline": "SG",
              "Destination": "DXB",
              "FareBasisCode": "USAVER",
              "FareRuleIndex": "",
              "FareFamilyCode": "",
              "FareRuleDetail": "",
              "FareRestriction": ""
            }
          ],
          "GSTAllowed": true,
          "AirlineCode": "SG",
          "ResultIndex": "OB4",
          "IsRefundable": true,
          "AirlineRemark": "this is a test from aditya.",
          "FareBreakdown": [
            {
              "Tax": 1610,
              "YQTax": 350,
              "BaseFare": 6670,
              "Currency": "INR",
              "PGCharge": 0,
              "PassengerType": 1,
              "PassengerCount": 1,
              "AdditionalTxnFeePub": 0,
              "AdditionalTxnFeeOfrd": 0
            }
          ],
          "IsGSTMandatory": false,
          "LastTicketDate": null,
          "TicketAdvisory": null,
          "ValidatingAirline": "SG",
          "IsCouponAppilcable": true,
          "IsHoldAllowedWithSSR": false
        },
        "cheapestFlight": {
          "data": [
            {
              "Fare": {
                "Tax": 1608,
                "YQTax": 350,
                "BaseFare": 6650,
                "ChargeBU": [
                  {
                    "key": "TBOMARKUP",
                    "value": 0
                  },
                  {
                    "key": "CONVENIENCECHARGE",
                    "value": 0
                  },
                  {
                    "key": "OTHERCHARGE",
                    "value": 59
                  }
                ],
                "Currency": "INR",
                "Discount": 0,
                "PGCharge": 0,
                "TdsOnPLB": 0,
                "PLBEarned": 0,
                "ServiceFee": 0,
                "TaxBreakup": [
                  {
                    "key": "K3",
                    "value": 352
                  },
                  {
                    "key": "YQTax",
                    "value": 350
                  },
                  {
                    "key": "YR",
                    "value": 50
                  },
                  {
                    "key": "PSF",
                    "value": 0
                  },
                  {
                    "key": "UDF",
                    "value": 82
                  },
                  {
                    "key": "INTax",
                    "value": 0
                  },
                  {
                    "key": "TransactionFee",
                    "value": 0
                  },
                  {
                    "key": "OtherTaxes",
                    "value": 774
                  }
                ],
                "OfferedFare": 8317,
                "OtherCharges": 59,
                "PublishedFare": 8317,
                "TdsOnIncentive": 0,
                "IncentiveEarned": 0,
                "TdsOnCommission": 0,
                "CommissionEarned": 0,
                "TotalMealCharges": 0,
                "TotalSeatCharges": 0,
                "AdditionalTxnFeePub": 0,
                "TotalBaggageCharges": 0,
                "AdditionalTxnFeeOfrd": 0,
                "TotalSpecialServiceCharges": 0
              },
              "IsLCC": true,
              "Source": 25,
              "Segments": [
                [
                  {
                    "Mile": 0,
                    "Craft": "737",
                    "Origin": {
                      "Airport": {
                        "CityCode": "MAA",
                        "CityName": "Chennai",
                        "Terminal": "1",
                        "AirportCode": "MAA",
                        "AirportName": "Chennai",
                        "CountryCode": "IN",
                        "CountryName": "India"
                      },
                      "DepTime": "2020-02-18T09:55:00"
                    },
                    "Remark": null,
                    "Status": "",
                    "Airline": {
                      "FareClass": "U",
                      "AirlineCode": "SG",
                      "AirlineName": "SpiceJet",
                      "FlightNumber": "611",
                      "OperatingCarrier": ""
                    },
                    "Baggage": "30 KG",
                    "Duration": 65,
                    "StopOver": false,
                    "StopPoint": "",
                    "GroundTime": 0,
                    "Destination": {
                      "Airport": {
                        "CityCode": "IXM",
                        "CityName": "Madurai",
                        "Terminal": "1",
                        "AirportCode": "IXM",
                        "AirportName": "Madurai",
                        "CountryCode": "IN",
                        "CountryName": "India"
                      },
                      "ArrTime": "2020-02-18T11:00:00"
                    },
                    "CabinBaggage": "7 KG",
                    "FlightStatus": "Confirmed",
                    "TripIndicator": 1,
                    "FlightInfoIndex": "",
                    "SegmentIndicator": 1,
                    "IsETicketEligible": true,
                    "NoOfSeatAvailable": 1,
                    "StopPointArrivalTime": null,
                    "StopPointDepartureTime": null
                  },
                  {
                    "Mile": 0,
                    "Craft": "737",
                    "Origin": {
                      "Airport": {
                        "CityCode": "IXM",
                        "CityName": "Madurai",
                        "Terminal": "1",
                        "AirportCode": "IXM",
                        "AirportName": "Madurai",
                        "CountryCode": "IN",
                        "CountryName": "India"
                      },
                      "DepTime": "2020-02-18T19:05:00"
                    },
                    "Remark": null,
                    "Status": "",
                    "Airline": {
                      "FareClass": "U",
                      "AirlineCode": "SG",
                      "AirlineName": "SpiceJet",
                      "FlightNumber": "23",
                      "OperatingCarrier": ""
                    },
                    "Baggage": "30 KG",
                    "Duration": 270,
                    "StopOver": false,
                    "StopPoint": "",
                    "GroundTime": 485,
                    "Destination": {
                      "Airport": {
                        "CityCode": "DXB",
                        "CityName": "Dubai",
                        "Terminal": "1",
                        "AirportCode": "DXB",
                        "AirportName": "Dubai",
                        "CountryCode": "AE",
                        "CountryName": "United Arab Emirates"
                      },
                      "ArrTime": "2020-02-18T22:05:00"
                    },
                    "CabinBaggage": "7 KG",
                    "FlightStatus": "Confirmed",
                    "TripIndicator": 1,
                    "FlightInfoIndex": "",
                    "SegmentIndicator": 2,
                    "IsETicketEligible": true,
                    "NoOfSeatAvailable": 1,
                    "AccumulatedDuration": 820,
                    "StopPointArrivalTime": null,
                    "StopPointDepartureTime": null
                  }
                ]
              ],
              "FareRules": [
                {
                  "Origin": "MAA",
                  "Airline": "SG",
                  "Destination": "IXM",
                  "FareBasisCode": "USAVER",
                  "FareRuleIndex": "",
                  "FareFamilyCode": "",
                  "FareRuleDetail": "",
                  "FareRestriction": ""
                },
                {
                  "Origin": "IXM",
                  "Airline": "SG",
                  "Destination": "DXB",
                  "FareBasisCode": "USAVER",
                  "FareRuleIndex": "",
                  "FareFamilyCode": "",
                  "FareRuleDetail": "",
                  "FareRestriction": ""
                }
              ],
              "GSTAllowed": true,
              "AirlineCode": "SG",
              "ResultIndex": "OB1",
              "IsRefundable": true,
              "AirlineRemark": "Remarks for star Coupon.",
              "FareBreakdown": [
                {
                  "Tax": 1608,
                  "YQTax": 350,
                  "BaseFare": 6650,
                  "Currency": "INR",
                  "PGCharge": 0,
                  "PassengerType": 1,
                  "PassengerCount": 1,
                  "AdditionalTxnFeePub": 0,
                  "AdditionalTxnFeeOfrd": 0
                }
              ],
              "IsGSTMandatory": false,
              "LastTicketDate": null,
              "TicketAdvisory": null,
              "ValidatingAirline": "SG",
              "IsCouponAppilcable": true,
              "IsHoldAllowedWithSSR": false
            }
          ],
          "label": "Cheapest Flights",
          "total_amount": 8317
        },
        "highestFlight_amt": 8409.8,
        "cheapestFlight_amt": 8317
      },
      "service_charges_details": {
        "GST_total": 0,
        "cgst_onward": 0,
        "cgst_return": 0,
        "igst_onward": 0,
        "igst_return": 0,
        "other_taxes": 0,
        "sgst_onward": 0,
        "sgst_return": 0,
        "cgst_Charges": 18,
        "igst_Charges": 0,
        "sgst_Charges": 18,
        "total_amount": 8145.8,
        "agency_markup": 0,
        "onward_markup": 0,
        "return_markup": 0,
        "markup_charges": 0,
        "service_charges": 200
      }
    },
    "booking_mode": "online",
    "assigned_to": null,
    "assigned_by": null,
    "comments": null,
    "trip_requests": {
      "sources": [
        ""
      ],
      "Segments": [
        {
          "Origin": "MAA",
          "OriginName": "Chennai",
          "Destination": "DXB",
          "DestinationName": "Dubai",
          "FlightCabinClass": "2",
          "OriginCountryCode": "IN",
          "PreferredArrivalTime": "2020-02-18T00:00:00",
          "DestinationCountryCode": "AE",
          "PreferredDepartureTime": "2020-02-18T00:00:00"
        }
      ],
      "AdultCount": "1",
      "ChildCount": "0",
      "InfantCount": "0",
      "JourneyType": 1
    },
    "cancellation_remarks": null,
    "trip_type": "business",
    "customer_id": 211,
    "status": "open",
    "transaction_id": null,
    "managers": {
      "id": 489,
      "name": "Mari",
      "email": "mari@tripmidas.com"
    },
    "user_id": 489,
    "req_id": 1706,
    "traveller_id": 489,
    "travel_date": "2020-02-18T00:00:00.000Z"
  }
}