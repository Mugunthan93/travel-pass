import { Injectable } from '@angular/core';
import { NativeHttpService } from '../http/native-http/native-http.service';
import { HTTPResponse } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  constructor(
    private http : NativeHttpService
  ) { }

  async createBranch(branchDetail, companyId : number): Promise<HTTPResponse> {
    const branchObject = {
      company_name: branchDetail.name,
      company_address_line1: branchDetail.address,
      phone_number: branchDetail.mobile_number,
      gst_details: {
        gstNo: branchDetail.gst_number
      },
      agency_id: companyId,
      company_type: "corporate_branch",
      status: false
    }
    console.log(branchObject);
    try {
      let createBranchResponse = await this.http.post("/customers/", branchObject);
      console.log(createBranchResponse);
      return createBranchResponse;
    }
    catch (error) {
      console.log(error);
    }
  }

  async getBranch(companyId : number) {
    return await this.http.get("/customers/get/getallbranches/corporate/corporate_branch/" + companyId,undefined);
  }

  async updateBranch() {
    
  }
}


// web payload
// Users: []
// agency_id: 252
// cash_limits: { amount: 0, days: 0 }
// city: "Chennai"
// company_address_line1: "add1"
// company_email: "sonicgrandpa74@gmail.com"
// company_logo: null
// company_name: "sarathmarimain"
// company_type: "corporate_branch"
// consolidator: []
// country_code: "IN"
// country_name: "India"
// credit_req: null
// gst_details: { gstNo: "", email: "", phoneNumber: "" }
// leg: { isSingleleg: true, isMultileg: false }
// markup_charges: { domesticCharge: 0, serviceHotelCharge: 0, serviceBusCharge: 0, serviceCarCharge: 0, … }
// need_approval: false
// outsource_to_tripmidas: false
// phone_number: "1231231234"
// rights_to_book: false
// service_charges: { domesticCharge: 0, serviceHotelCharge: 0, serviceBusCharge: 0, serviceCarCharge: 0, … }
// status: true
// travel_type: { isInternational: false, isDomestic: true }


// web response
// CCODE: null
// PCC: null
// SCODE: null
// agency_id: 252
// cash_limits: { days: 0, amount: 0 }
// city: "Chennai"
// company_address_line1: "add1"
// company_address_line2: null
// company_email: "sonicgrandpa74@gmail.com"
// company_logo: null
// company_name: "sarathmarimain"
// company_type: "corporate_branch"
// consolidator: []
// corp_code: null
// country_code: "IN"
// country_name: "India"
// createdAt: "2020-05-15T17:27:38.881Z"
// credit_req: null
// expense: null
// gst_details: { email: "", gstNo: "", phoneNumber: "" }
// id: 258
// invoice_prefix: null
// leg: { isMultileg: false, isSingleleg: true }
// markup_charges: { state_name: "Tamil Nadu", domesticCharge: 0, serviceBusCharge: 0, serviceCarCharge: 0, … }
// need_approval: false
// outsource_to_tripmidas: false
// pan_number: null
// payment_method: null
// permissions: null
// phone_number: "1231231234"
// pincode: null
// queue_number: null
// rights_to_book: false
// sales_id: null
// service_charges: { state_name: "Tamil Nadu", domesticCharge: 0, serviceBusCharge: 0, serviceCarCharge: 0, … }
// status: true
// target_branch: null
// tm_credit_online: null
// travel_type: { isDomestic: true, isInternational: false }
// updatedAt: "2020-05-15T17:27:38.881Z"
// vendor_type: null