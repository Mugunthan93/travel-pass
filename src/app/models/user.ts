export class PersonalDetail {
  id: number;
  name: string;
  lastname: string;
  email: string;
  dob: string;
  city: string;
  gender: string;
  status: string;
  address: string;
  password: string;
  PAN_number: string;
  passport_no: string;
  country_name: string;
  phone_number: string;
  passport_expiry: string;
  validity_period: string;
  resetPasswordToken: string;
  is_Password_Changed: string;
  resetPasswordExpires: string;

  constructor(user){
    this.id = user.id;
    this.name = user.name;
    this.lastname = user.lastname;
    this.email = user.email;
    this.dob = user.dob;
    this.city = user.city;
    this.gender = user.gender;
    this.status = user.status;
    this.address = user.address;
    this.password = user.password;
    this.PAN_number = user.PAN_number;
    this.passport_no = user.passport_no;
    this.country_name = user.country_name;
    this.phone_number = user.phone_number;
    this.passport_expiry = user.passport_expiry;
    this.validity_period = user.validity_period;
    this.resetPasswordToken = user.resetPasswordExpires;
    this.is_Password_Changed = user.is_Password_Changed;
    this.resetPasswordExpires = user.resetPasswordExpires;
  }


}

export class CompanyDetail {
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
  constructor(user){
    this.customer_id = user.customer_id;
    this.role = user.role;
    this.grade = user.grade;
    this.approver = user.approver;
    this.sales_id =  user.sales_id;
    this.credit_req = user.credit_req;
    this.designation =  user.designation;
    this.gst_details = user.gst_details;
    this.credit_limit =  user.credit_limit;
    this.manager_name =  user.manager_name;
    this.manager_email = user.manager_email;
    this.markup_charge = user.markup_charge;
    this.service_charge =  user.service_charge;
    this.is_rightsto_book =  user.is_rightsto_book;
  }
}
export class User {
  
  personal_detail : PersonalDetail
  company_detail : CompanyDetail
  createdAt: string;
  updatedAt: string;
  created_by: string;
  
  
  constructor(user){
    this.personal_detail = new PersonalDetail(user);
    this.company_detail = new CompanyDetail(user);
  }

  

}








  