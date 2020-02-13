export class User {

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

  constructor(user) {
    this.name = user.name;
    this.email = user.email;
    this.phone_number = user.phone_number;
    this.dob = user.dob;
    this.PAN_number = user.PAN_number;
    this.aadhar_no = user.aadhar_no;
    this.address = user.address;
    this.city = user.city;
    this.gender = user.gender;
    this.status = user.status;
    this.lastname = user.lastname;
    this.password = this.password;
    this.passport_no = this.passport_no;
    this.passport_expiry = user.passport_expiry;
    this.validity_period = user.validity_period;

    this.id = user.id;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.created_by = user.created_by;
    this.resetPasswordToken = user.resetPasswordToken;
    this.resetPasswordExpires = user.resetPasswordExpires;
    this.is_Password_Changed = user.is_Password_Changed;

    this.customer_id = user.customer_id;
    this.role = user.role;
    this.grade = user.grade;
    this.approver = user.approver;
    this.sales_id = user.sales_id;
    this.credit_req = user.credit_req;
    this.designation = user.designation;
    this.gst_details = user.gst_details;
    this.credit_limit = user.credit_limit;
    this.manager_name = user.manager_name;
    this.manager_email = user.manager_email;
    this.markup_charge = user.markup_charge;
    this.service_charge = user.service_charge;
    this.is_rightsto_book = user.is_rightsto_book;
  }

}








