export interface login {
  username : string,
  passwrod : string
}

export interface user {

  name: string;
  email: string;
  phone_number: string;
  dob: string;
  PAN_number: string;
  aadhar_no: string;
  address: string;
  city: string;
  gender: string;
  status: string;
  lastname: string;
  password: string;
  passport_no: string;
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
  role: string;
  grade: string;
  approver: Array<object>;
  sales_id: string;
  credit_req: Array<object>;
  designation: string;
  gst_details: string;
  credit_limit: number;
  manager_name: string;
  manager_email: string;
  markup_charge: string;
  service_charge: string;
  is_rightsto_book: string;

}



