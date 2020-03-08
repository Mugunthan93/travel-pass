export interface login {
    username: string,
    password: string
}
  
export interface logout {
  message : string;
}

export interface company{
  name: string,
  auth_sign_name: string,
  phone_number: string,
  gst_email: string,
  branch : branch[]
}

export interface branch{
  name: string,
  address: string,
  gst_number: string,
  gst_phone_number: string
}

export interface user {

  name: string,
  phone_number: string,
  email: string,
  approver: approver;
  role: string,

  dob: string,
  PAN_number: string,
  aadhar_no: string,
  address: string,
  emergency_contact: string,
  passport_number: string

  city: string;
  gender: string;
  status: string;
  lastname: string;
  password: string;
  country_name: string;
  passport_expiry: string;
  validity_period: string;

  id: number;
  createdAt: string;
  updatedAt: string;
  created_by: string;
  resetPasswordToken: string;
  is_Password_Changed: string;
  resetPasswordExpires: string;

  customer_id: number;
  grade: string;
  sales_id: string;
  credit_req: creditReq;
  designation: string;
  credit_limit: number;
  manager_name: string;
  manager_email: string;
  markup_charge: string;
  service_charge: string;
  is_rightsto_book: string;
  
}

export interface approver {
  id: number
  name: string
  email: string
  label: string
  customer_id: number
  customer_name: string
}

export interface creditReq {
  id: number
  name: string
  email: string
  label: string
  customer_id: number
  customer_name: string
}