export const environment = {
  production: true,

  baseURL: "https://api.business.travellerspass.com/V1.0",
  host: "api.business.travellerspass.com",
  origin: "https://business.travellerspass.com",
  tbobaseURL: "https://api.prod.booking.travellerspass.com/V1.0",
  pay_baseURL: "https://test.instamojo.com/api/1.1",

  // baseURL: "https://api.dev.travellerspass.com/V1.0",
  // host: "api.dev.travellerspass.com",
  // origin:"https://demo.travellerspass.com",
  // tbobaseURL: "https://api.dev.travellerspass.com/V1.0",
  // pay_baseURL: "https://test.instamojo.com/api/1.1",


  razorpaykey: "rzp_test_hQbSVXzkMOCiRW",
  demoUrl: false,
  mainEnumStatus: [
    { lb: "New", val: "open", index: 0 },
    { lb: "History", val: "booked", index: 1 }
  ],
  tripEnumStatus: [
    { lb: "Booked", val: "booked", index: 1 },
    {
      lb: "Cancellation Pending",
      val: "cancellation request",
      index: 3
    },
    { lb: "Cancelled", val: "cancelled", index: 4 },
    { lb: "Reschedule Pending", val: "reschedule_request", index: 5 },
    { lb: "Rescheduled", val: "rescheduled", index: 6 }
  ],
  exportHDR: [
    "DOC_PRF,	DOC_NOS,	DOC_SRNO	,IDM_FLAG,	IL_REF,	VD_REF,	IDATE,	SaleDate,	CCODE,	DCODE,	ECODE,	BCODE,	REFR_KEY,	NARRATION,	LOC_CODE,	CST_CODE,	XO_REF,	ACODE,	SCODE,	XO_NOS,	PNR_NO,	TICKETNO,	PAX,	SECTOR,	CRS_ID,	FARE_BASIS,	DEAL_CODE,	NOS_PAX_A,	NOS_PAX_C,	NOS_PAX_I,	FLT_DTLS1,	FLT_DTLS2,	FLT_DTLS3,	FLT_DTLS4,	Curcode_C,	R_O_E_C,	Curcode_S,	R_O_E_S,	BASIC_PBL,	BASIC_FARE,	TAX_1,	TAX_2,	TAX_3,	TAX_4,	TAX_5,	TAX_6,	TAX_7,	TAX_8"
  ],
  filterBy: {
    start_date: "",
    end_date: "",
    id: "",
    limit: "",
    booking_mode: ""
  },
  portal_version: "V1",
  baseUrlMode: "PROD",
  idle: 1500,
  timeout: 10,
  ping: 120,
  map_js_key: 'AIzaSyDVaJa4N9N1qM8OglHSt5BKsqPn8LikZJk',
  vendorID:1506
};
