// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseURL: "https://api.dev.travellerspass.com/V1.0",
  tbobaseURL: "https://api.dev.travellerspass.com/V1.0",
  pay_baseURL: "https://test.instamojo.com/api/1.1",
  razorpaykey: null,
  demoUrl: false,
  // tslint:disable-next-line: object-literal-key-quotes
  mainEnumStatus: [
    { lb: "New", val: "open", index: 0 },
    { lb: "History", val: "booked", index: 1 }
  ],
  tripEnumStatus: [
    // tslint:disable-next-line: object-literal-key-quotes
    { lb: "Booked", val: "booked", index: 1 },
    {
      lb: "Cancellation Pending",
      val: "cancellation request",
      index: 3
    },
    // tslint:disable-next-line: object-literal-key-quotes
    { lb: "Cancelled", val: "cancelled", index: 4 },
    { lb: "Reschedule Pending", val: "reschedule_request", index: 5 },
    // tslint:disable-next-line: object-literal-key-quotes
    { lb: "Rescheduled", val: "rescheduled", index: 6 }
  ],
  exportHDR: [
    // tslint:disable-next-line: max-line-length
    "DOC_PRF,	DOC_NOS,	DOC_SRNO	,IDM_FLAG,	IL_REF,	VD_REF,	IDATE, SaleDate,	CCODE,	DCODE,	ECODE,	BCODE,	REFR_KEY,	NARRATION,	LOC_CODE,	CST_CODE,	XO_REF,	ACODE,	SCODE,	XO_NOS,	PNR_NO,	TICKETNO,	PAX,	SECTOR,	CRS_ID,	FARE_BASIS,	DEAL_CODE,	NOS_PAX_A,	NOS_PAX_C,	NOS_PAX_I,	FLT_DTLS1,	FLT_DTLS2,	FLT_DTLS3,	FLT_DTLS4,	Curcode_C,	R_O_E_C,	Curcode_S,	R_O_E_S,	BASIC_PBL,	BASIC_FARE,	TAX_1,	TAX_2,	TAX_3,	TAX_4,	TAX_5,	TAX_6,	TAX_7,	TAX_8"
  ],
  // tslint:disable-next-line: object-literal-key-quotes
  filterBy: {
    start_date: "",
    end_date: "",
    id: "",
    limit: "",
    booking_mode: ""
  },
  portal_version: "V2",
  baseUrlMode: "DEV",
  idle: 1500,
  timeout: 10,
  ping: 120
};
