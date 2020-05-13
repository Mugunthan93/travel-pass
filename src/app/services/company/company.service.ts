import { Injectable } from '@angular/core';
import { NativeHttpService } from '../http/native-http/native-http.service';
import { HTTPResponse } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(
    private http : NativeHttpService
  ) {
   }

  async createCompany(companyDetails) : Promise<HTTPResponse> {
    const companyObject = {
      company_name: companyDetails.company_name,
      company_address_line1: companyDetails.company_address,
      company_email: companyDetails.bussiness_email_id,
      gst_details: {
        gstNo: companyDetails.gst_number
      }
    }
    return await this.http.post("/customers/", companyObject);
  }
}








// create company payload
// Users: []
// cash_limits: { amount: 10000, days: 0 }
// city: "Cittadella"
// company_address_line1: "add 1"
// company_address_line2: "add 2"
// company_email: "sonicbro4@gmail.com"
// company_name: "mobiletravelpass"
// company_type: "corporate"
// consolidator: []
// corp_code: [{ airlineCode: "", corpCode: "", airlineName: "" }]
// 0: { airlineCode: "", corpCode: "", airlineName: "" }
// airlineCode: ""
// airlineName: ""
// corpCode: ""
// country_code: "IT"
// country_name: "Italy"
// expense: true
// gst_details: { gstNo: "", email: "", phoneNumber: "" }
// email: ""
// gstNo: ""
// phoneNumber: ""
// markup_charges: { domesticCharge: 0, serviceHotelCharge: 0, serviceBusCharge: 0, serviceCarCharge: 0, … }
// domesticCharge: 0
// internationalCharge: 0
// serviceBusCharge: 0
// serviceCarCharge: 0
// serviceHotelCharge: 0
// state_name: "Other_state"
// need_approval: false
// outsource_to_tripmidas: false
// pan_number: "bpbpm7721p"
// payment_method: "cash"
// phone_number: "9988776622"
// pincode: "612001"
// rights_to_book: true
// service_charges: { domesticCharge: "1", serviceHotelCharge: 1, serviceBusCharge: "1", serviceCarCharge: "1", … }
// cancellationCharge: 1
// domesticCharge: "1"
// internationalCharge: 1
// serviceBusCharge: "1"
// serviceCarCharge: "1"
// serviceHotelCharge: 1
// state_name: "Other_state"
// status: true

// create company Response
// data: { id: 234, consolidator: [], rights_to_book: true, need_approval: false, outsource_to_tripmidas: false, … }
// CCODE: null
// PCC: null
// SCODE: null
// agency_id: 81
// cash_limits: { days: 0, amount: 10000 }
// amount: 10000
// days: 0
// city: "Cittadella"
// company_address_line1: "add 1"
// company_address_line2: "add 2"
// company_email: "sonicbro4@gmail.com"
// company_logo: null
// company_name: "mobiletravelpass"
// company_type: "corporate"
// consolidator: []
// corp_code: [{ corpCode: "", airlineCode: "", airlineName: "" }]
// 0: { corpCode: "", airlineCode: "", airlineName: "" }
// airlineCode: ""
// airlineName: ""
// corpCode: ""
// country_code: "IT"
// country_name: "Italy"
// createdAt: "2020-05-12T19:21:44.237Z"
// credit_req: null
// expense: true
// gst_details: { email: "", gstNo: "", phoneNumber: "" }
// email: ""
// gstNo: ""
// phoneNumber: ""
// id: 234
// invoice_prefix: null
// leg: null
// markup_charges: { state_name: "Other_state", domesticCharge: 0, serviceBusCharge: 0, serviceCarCharge: 0, … }
// domesticCharge: 0
// internationalCharge: 0
// serviceBusCharge: 0
// serviceCarCharge: 0
// serviceHotelCharge: 0
// state_name: "Other_state"
// need_approval: false
// outsource_to_tripmidas: false
// pan_number: "bpbpm7721p"
// payment_method: "cash"
// permissions: null
// phone_number: "9988776622"
// pincode: 612001
// queue_number: null
// rights_to_book: true
// sales_id: null
// service_charges: { state_name: "Other_state", domesticCharge: "1", serviceBusCharge: "1", serviceCarCharge: "1", … }
// cancellationCharge: 1
// domesticCharge: "1"
// internationalCharge: 1
// serviceBusCharge: "1"
// serviceCarCharge: "1"
// serviceHotelCharge: 1
// state_name: "Other_state"
// status: true
// target_branch: null
// tm_credit_online: null
// travel_type: null
// updatedAt: "2020-05-12T19:21:44.237Z"
// vendor_type: null
// message: "Customer Onboard Successfull"
// status: "Success"
// status_code: 200