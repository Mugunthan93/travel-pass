import { Component, OnInit, Input } from '@angular/core';
import { FlightResultState, itinerarytrip, itineraryFlight, itineraryconnectingflight, emailtrip, SendEmail } from 'src/app/stores/result/flight.state';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { FlightService } from 'src/app/services/flight/flight.service';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { FormControl, Validators } from '@angular/forms';
import { StateReset } from 'ngxs-reset-plugin';

export interface itineraryPayload{
  toemail: string,
  ccemail: string,
  bccemail: string,
  subject: string,
  mailcontent: string
}

@Component({
  selector: 'app-email-itinerary',
  templateUrl: './email-itinerary.component.html',
  styleUrls: ['./email-itinerary.component.scss'],
})
export class EmailItineraryComponent implements OnInit {

  emailId: FormControl;
  
  heading: string = "content head";

  itinerary: string = "";
  itinerary$: Observable<itinerarytrip[]>;
  itinerarySub: Subscription;

  emailtrip: emailtrip = null;
  emailtrip$: Observable<emailtrip>;
  emailtripSub: Subscription;

  emailPayload: itineraryPayload = {
    bccemail: "nadesan@tripmidas.com",
    ccemail: "support@tripmidas.com,operations@tripmidas.com",
    mailcontent : "",
    subject : "Your itineraries for Flight",
    toemail : ""
  }

  constructor(
    private store: Store,
    private flightService: FlightService,
    public modalCtrl: ModalController
  ) {

  }

  ngOnInit() {

    this.emailId = new FormControl(null,
      [
        Validators.required,
        Validators.email,
        Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,63}'
        )]);
    
    console.log(this.emailId);

    this.emailtrip$ = this.store.select(FlightResultState.getemailTrip);
    this.emailtripSub = this.emailtrip$.subscribe(
      (email: emailtrip) => {
        
        this.emailtrip = email;

        this.itinerary$ = this.store.select(FlightResultState.getItinerary);
        this.itinerarySub = this.itinerary$.subscribe(
          (itinerary: itinerarytrip[]) => {
            this.itinerary = this.itineraryContent(itinerary);
          });
      }
    );

  }

  openContent(): string {
    let htmlopen: string = "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'> <html xmlns='http://www.w3.org/1999/xhtml'>"

    let head: string = "<head> <meta http-equiv='Content-Type' content='text/html; charset=UTF-8' /> <meta name='viewport' content='width=device-width, initial-scale=1.0'> <meta http-equiv='X-UA-Compatible' content='IE=edge,chrome=1'> <meta name='format-detection' content='telephone=no' /> <!-- disable auto telephone linking in iOS --> <title>Respmail is a response HTML email designed to work on all major email platforms and smartphones</title> <style type='text/css'> /* RESET STYLES */ html { background-color:none; margin:0; padding:0; } body, #bodyTable, #bodyCell, #bodyCell{height:100% !important; margin:0; padding:0; width:100% !important;font-family:Helvetica, Arial, 'Lucida Grande', sans-serif;} table{border-collapse:collapse;} table[id=bodyTable] {width:100%!important;margin:auto;max-width:500px!important;color:#7A7A7A;font-weight:normal;} img, a img{border:0; outline:none; text-decoration:none;height:auto; line-height:100%;} a {text-decoration:none !important;border-bottom: 1px solid;} h1, h2, h3, h4, h5, h6{color:#5F5F5F; font-weight:normal; font-family:Helvetica; font-size:20px; line-height:125%; text-align:Left; letter-spacing:normal;margin-top:0;margin-right:0;margin-bottom:10px;margin-left:0;padding-top:0;padding-bottom:0;padding-left:0;padding-right:0;} /* CLIENT-SPECIFIC STYLES */ .ReadMsgBody{width:100%;} .ExternalClass{width:100%;} /* Force Hotmail/Outlook.com to display emails at full width. */ .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div{line-height:100%;} /* Force Hotmail/Outlook.com to display line heights normally. */ table, td{mso-table-lspace:0pt; mso-table-rspace:0pt;} /* Remove spacing between tables in Outlook 2007 and up. */ #outlook a{padding:0;} /* Force Outlook 2007 and up to provide a 'view in browser' message. */ img{-ms-interpolation-mode: bicubic;display:block;outline:none; text-decoration:none;} /* Force IE to smoothly render resized images. */ body, table, td, p, a, li, blockquote{-ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; font-weight:bold!important;} /* Prevent Windows- and Webkit-based mobile platforms from changing declared text sizes. */ .ExternalClass td[class='ecxflexibleContainerBox'] h3 {padding-top: 10px !important;} /* Force hotmail to push 2-grid sub headers down */ /* /\/\/\/\/\/\/\/\/ TEMPLATE STYLES /\/\/\/\/\/\/\/\/ */ /* ========== Page Styles ========== */ h1{display:block;font-size:26px;font-style:normal;font-weight:normal;line-height:100%;} h2{display:block;font-size:20px;font-style:normal;font-weight:normal;line-height:120%;} h3{display:block;font-size:17px;font-style:normal;font-weight:normal;line-height:110%;} h4{display:block;font-size:18px;font-style:italic;font-weight:normal;line-height:100%;} .flexibleImage{height:auto;} .linkRemoveBorder{border-bottom:0 !important;} table[class=flexibleContainerCellDivider] {padding-bottom:0 !important;padding-top:0 !important;} body, #bodyTable{background-color:#E1E1E1;} #emailHeader{background-color:#E1E1E1;} #emailBody{background-color:#FFFFFF;} #emailFooter{background-color:#E1E1E1;} .nestedContainer{background-color:#F8F8F8; border:1px solid #CCCCCC;} .emailButton{background-color:#205478; border-collapse:separate;} .buttonContent{color:#FFFFFF; font-family:Helvetica; font-size:18px; font-weight:bold; line-height:100%; padding:15px; text-align:center;} .buttonContent a{color:#FFFFFF; display:block; text-decoration:none!important; border:0!important;} .emailCalendar{background-color:#FFFFFF; border:1px solid #CCCCCC;} .emailCalendarMonth{background-color:#205478; color:#FFFFFF; font-family:Helvetica, Arial, sans-serif; font-size:16px; font-weight:bold; padding-top:10px; padding-bottom:10px; text-align:center;} .emailCalendarDay{color:#205478; font-family:Helvetica, Arial, sans-serif; font-size:60px; font-weight:bold; line-height:100%; padding-top:20px; padding-bottom:20px; text-align:center;} .imageContentText {margin-top: 10px;line-height:0;} .imageContentText a {line-height:0;} #invisibleIntroduction {display:none !important;} /* Removing the introduction text from the view */ /*FRAMEWORK HACKS & OVERRIDES */ span[class=ios-color-hack] a {color:#275100!important;text-decoration:none!important;} /* Remove all link colors in IOS (below are duplicates based on the color preference) */ span[class=ios-color-hack2] a {color:#205478!important;text-decoration:none!important;} span[class=ios-color-hack3] a {color:#8B8B8B!important;text-decoration:none!important;} /* A nice and clean way to target phone numbers you want clickable and avoid a mobile phone from linking other numbers that look like, but are not phone numbers. Use these two blocks of code to 'unstyle' any numbers that may be linked. The second block gives you a class to apply with a span tag to the numbers you would like linked and styled. Inspired by Campaign Monitor's article on using phone numbers in email: http://www.campaignmonitor.com/blog/post/3571/using-phone-numbers-in-html-email/. */ .a[href^='tel'], a[href^='sms'] {text-decoration:none!important;color:#606060!important;pointer-events:none!important;cursor:default!important;} .mobile_link a[href^='tel'], .mobile_link a[href^='sms'] {text-decoration:none!important;color:#606060!important;pointer-events:auto!important;cursor:default!important;} /* MOBILE STYLES */ @media only screen and (max-width: 480px){ /*////// CLIENT-SPECIFIC STYLES //////*/ body{width:100% !important; min-width:100% !important;} /* Force iOS Mail to render the email at full width. */ /* FRAMEWORK STYLES */ /* CSS selectors are written in attribute selector format to prevent Yahoo Mail from rendering media query styles on desktop. */ /*td[class='textContent'], td[class='flexibleContainerCell'] { width: 100%; padding-left: 10px !important; padding-right: 10px !important; }*/ table[id='emailHeader'], table[id='emailBody'], table[id='emailFooter'], table[class='flexibleContainer'], td[class='flexibleContainerCell'] {width:100% !important;} td[class='flexibleContainerBox'], td[class='flexibleContainerBox'] table {display: block;width: 100%;text-align: left;} /* The following style rule makes any image classed with 'flexibleImage' fluid when the query activates. Make sure you add an inline max-width to those images to prevent them from blowing out. */ td[class='imageContent'] img {height:auto !important; width:100% !important; max-width:100% !important; } img[class='flexibleImage']{height:auto !important; width:100% !important;max-width:100% !important;} img[class='flexibleImageSmall']{height:auto !important; width:auto !important;} /* Create top space for every second element in a block */ table[class='flexibleContainerBoxNext']{padding-top: 10px !important;} /* Make buttons in the email span the full width of their container, allowing for left- or right-handed ease of use. */ table[class='emailButton']{width:100% !important;} td[class='buttonContent']{padding:0 !important;} td[class='buttonContent'] a{padding:15px !important;} } /* CONDITIONS FOR ANDROID DEVICES ONLY * http://developer.android.com/guide/webapps/targeting.html * http://pugetworks.com/2011/04/css-media-queries-for-targeting-different-mobile-devices/ ; =====================================================*/ @media only screen and (-webkit-device-pixel-ratio:.75){ /* Put CSS for low density (ldpi) Android layouts in here */ } @media only screen and (-webkit-device-pixel-ratio:1){ /* Put CSS for medium density (mdpi) Android layouts in here */ } @media only screen and (-webkit-device-pixel-ratio:1.5){ /* Put CSS for high density (hdpi) Android layouts in here */ } /* end Android targeting */ /* CONDITIONS FOR IOS DEVICES ONLY =====================================================*/ @media only screen and (min-device-width : 320px) and (max-device-width:568px) { } /* end IOS targeting */ </style> <!-- Outlook Conditional CSS These two style blocks target Outlook 2007 & 2010 specifically, forcing columns into a single vertical stack as on mobile clients. This is primarily done to avoid the 'page break bug' and is optional. More information here: http://templates.mailchimp.com/development/css/outlook-conditional-css --> <!--[if mso 12]> <style type='text/css'> .flexibleContainer{display:block !important; width:100% !important;} </style> <![endif]--> <!--[if mso 14]> <style type='text/css'> .flexibleContainer{display:block !important; width:100% !important;} </style> <![endif]--> </head>"

    let bodyopen: string = "<body bgcolor='#E1E1E1' leftmargin='0' marginwidth='0' topmargin='0' marginheight='0' offset='0'>"

    let centeropen: string = "<!-- CENTER THE EMAIL // --> <!-- 1. The center tag should normally put all the content in the middle of the email page. I added 'table-layout: fixed;' style to force yahoomail which by default put the content left. 2. For hotmail and yahoomail, the contents of the email starts from this center, so we try to apply necessary styling e.g. background-color. --> <center style='background-color:#E1E1E1;'>"

    let tableopen: string = "<table border='0' cellpadding='0' cellspacing='0' height='100%' width='100%' id='bodyTable' style='table-layout: fixed;max-width:100% !important;width: 100% !important;min-width: 100% !important;'> <tr>"

    let emailbodyopen: string = "<table bgcolor='#FFFFFF' border='0' cellpadding='0' cellspacing='0' width='500' id='emailBody'>"

    let logorow: string = "<!-- MODULE ROW // --> <!-- To move or duplicate any of the design patterns in this email, simply move or copy the entire MODULE ROW section for each content block. --> <tr> <td align='center' valign='top'> <!-- CENTERING TABLE // --> <!-- The centering table keeps the content tables centered in the emailBody table, in case its width is set to 100%. --> <table border='0' cellpadding='0' cellspacing='0' width='100%' style='color:#FFFFFF;' bgcolor='#3498db'> <tr> <td align='center' valign='top'> <!-- FLEXIBLE CONTAINER // --> <!-- The flexible container has a set width that gets overridden by the media query. Most content tables within can then be given 100% widths. --> <table border='0' cellpadding='0' cellspacing='0' width='500' class='flexibleContainer'> <tr> <td align='center' valign='top' width='500' class='flexibleContainerCell'> <!-- CONTENT TABLE // --> <!-- The content table is the first element that's entirely separate from the structural framework of the email. --> <table border='0' cellpadding='10' cellspacing='0' width='100%'> <tr> <td align='center' valign='top' class='textContent'> <img src='https://www.travellerspass.com/assets/logo.png' /> </td> </tr> <!-- <tr> <td align='center' valign='top' class='textContent'> <h2 style='text-align:center;font-weight:normal;font-family:Helvetica,Arial,sans-serif;font-size:23px;margin-bottom:10px;color:#205478;line-height:135%;'>A Comprehensive Corporate Travel Management</h2> <div style='text-align:center;font-family:Helvetica,Arial,sans-serif;font-size:15px;margin-bottom:0;color:#FFFFFF;line-height:135%;padding: 10px;'>TravellersPass helps Organisation manage complex travel needs round the clock in the most effective and cost efficient way.</div> </td> </tr> --> </table> <!-- // CONTENT TABLE --> </td> </tr> </table> <!-- // FLEXIBLE CONTAINER --> </td> </tr> </table> <!-- // CENTERING TABLE --> </td> </tr>"

    let headingrow: string = "<!-- // MODULE ROW --> <!-- MODULE ROW // --> <tr> <td align='center' valign='top'> <!-- CENTERING TABLE // --> <table border='0' cellpadding='0' cellspacing='0' width='100%'> <tr> <td align='center' valign='top'> <!-- FLEXIBLE CONTAINER // --> <table border='0' cellpadding='0' cellspacing='0' width='500' class='flexibleContainer'> <tr> <td valign='top' align='center' class='textContent' style='padding: 10px 0px 0px 0px;'> <h2 style='text-align:center;'>Your Itineraries for Flight</h2> </td> </tr> </table> <!-- // FLEXIBLE CONTAINER --> </td> </tr> </table> <!-- // CENTERING TABLE --> </td> </tr>"

    let itineraryrowopen: string = "<tr> <td align='center' valign='top'> <!-- CENTERING TABLE // --> <table border='0' cellpadding='0' cellspacing='0' width='100%' bgcolor='#F8F8F8'> <tr> <td align='center' valign='top'> <!-- FLEXIBLE CONTAINER // --> <table border='0' cellpadding='0' cellspacing='0' width='500' class='flexibleContainer' style='line-height:2;'> <tr> <td align='center' valign='top' width='500' class='flexibleContainerCell'> <table border='0' cellpadding='20' cellspacing='0' width='100%'>"

    return htmlopen + head + bodyopen + centeropen + tableopen + emailbodyopen + logorow + headingrow + itineraryrowopen;
    // forrow: string = "<!-- <tr *ngFor='let f of emailFlight'> <td>{{f.ResultIndex}} </td> </tr> -->"
  }

  itineraryContent(data: itinerarytrip[]): string {

    let trip: string = "<tr><td align='center' valign='top'><!-- CONTENT TABLE // --><table border='0' cellpadding='0' cellspacing='0' width='100%'><tr><td colspan='3' style='font-size:12px;text-align:justify;'><b>Dear User, </b><br>As per your request, we are forwarding itineraries from " + this.emailtrip.departure.name + "(" + this.emailtrip.departure.code + ")" + " to " + this.emailtrip.arrival.name + "(" + this.emailtrip.arrival.code + ")" + "<br></td></tr>";
    
    let itinerarytList : string = "";

    data.forEach(
      (element: itinerarytrip, index: number, array: itinerarytrip[]) => {

        let currentItineraray : number = index + 1;
        
        let itinerary: string = "<tr><td align = 'center' valign = 'top'><!--CONTENT TABLE // --><table border='0' cellpadding='0' cellspacing='0' width ='100%'><tr style='background:#dee4f6;padding:6px;'><td width='48%' colspan='2'><b style='margin-left: 5px;font-size:12px;'> Itinerary " + currentItineraray + " </b><b style='margin-left:5px;font-size:12px;'>" + element.class + "(<span style='color:#f58832;'> " + element.refundable + " </span>)</b></td><td width='48%' style='text-align:right'>Fare:Rs. " + element.fare + "</td></tr></table></td></tr>";

        element.flights.forEach(
          (el: itineraryFlight, ind: number, arr: itineraryFlight[]) => {

            let flight: string = "<tr><td><table border='0' cellpadding='0' cellspacing='0' width='100%'><tr style='background:#dee4f6;border:1px solid #d9deee;font-size:12px;'><td colspan='2'><b>" + el.origin.name + "(" + el.origin.code + ") to " + el.destination.name + " (" + el.destination.code + ")</b></td><td style='text-align:right'><b>" + el.passenger_detail + "</b></td></tr><br/></table></td></tr>";

            el.connecting_flight.forEach(
              (e: itineraryconnectingflight, i: number, a: itineraryconnectingflight[]) => {

                let connecting_flight = "<tr><td align='center' valign='top'><!-- CONTENT TABLE // --><table border='0' cellpadding='0' cellspacing='0' width='100%'><tr style='border-top:1px solid #d9deee;font-size: 11px; padding-left:20px; padding-right:0;'><td width='25%' style='font-weight:bold;'><img src='https://www.travellerspass.com/assets/AirlineLogo/" + e.airlineCode + ".gif' width='20' height='20' class='CToWUd'>&nbsp" + e.airlineName + "</td><td width='40%'><b>Depart:</b> " + e.origin.name + " (" + e.origin.code + ")</td><td width='35%' style='text-align:right'><b>Arrive:</b>" + e.destination.name + " (" + e.destination.code + ")</td></tr><tr style='font-size: 11px;'><td style='padding-bottom:10px'><b>" + e.airlineNumber + "</b></td><td style='padding-bottom:10px'><b>Time:</b>" + e.origin.date + "</td><td style = 'text-align:right;padding-bottom:10px' > <b>Time:</b>" + e.destination.date + "</td > </tr><tr style='font-size: 11px;'><td colspan='3' style='text-align:right'><b>Journey Time: </b>" + e.duration + "</td></tr></table> <!-- // CONTENT TABLE --></td></tr>";

                flight += connecting_flight;

              });
            
            itinerary += flight;   

        });
        
        itinerarytList += itinerary;
    });
    
    return trip + itinerarytList;
  }

  closeContent(): string { 
    let itineraryrowclose: string = "</table> </td> </tr> </table> <!-- // FLEXIBLE CONTAINER --> </td> </tr> </table> <!-- // CENTERING TABLE --> </td> </tr> <!-- // MODULE ROW --> <!-- MODULE ROW // --> <tr> <td align='center' valign='top'> <!-- CENTERING TABLE // --> <table border='0' cellpadding='0' cellspacing='0' width='100%'> <tr> <td align='center' valign='top'> <!-- FLEXIBLE CONTAINER // --> <table border='0' cellpadding='0' cellspacing='0' width='500' class='flexibleContainer'> <tr> <td align='center' valign='top' width='500' class='flexibleContainerCell'> <table border='0' cellpadding='0' cellspacing='0' width='100%'> <tr> <td align='center' valign='top'> <!-- CONTENT TABLE // --> <table border='0' cellpadding='0' cellspacing='0' width='100%'> <tr> <td valign='top' class='textContent'> <div style='text-align:center;font-family:Helvetica,Arial,sans-serif;font-size:15px;margin-bottom:0;margin-top:3px;color:#5F5F5F;line-height:135%;font-weight: normal;padding: 10px;'>Reach us out for all your travel needs. Our support is available to address any queries you have in regards to your travel itinerary, expenses, visas and more…</div> </td> </tr> </table> <!-- // CONTENT TABLE --> </td> </tr></table> </td> </tr> </table> <!-- // FLEXIBLE CONTAINER --> </td> </tr> </table> <!-- // CENTERING TABLE --> </td> </tr> <!-- // MODULE ROW -->"

    let emailbodyclose: string = "</table>";

    let emailfooter: string = "<!-- // END --> <!-- EMAIL FOOTER // --> <!-- The table 'emailBody' is the email's container. Its width can be set to 100% for a color band that spans the width of the page. --> <table bgcolor='#E1E1E1' border='0' cellpadding='0' cellspacing='0' width='500' id='emailFooter'> <!-- FOOTER ROW // --> <!-- To move or duplicate any of the design patterns in this email, simply move or copy the entire MODULE ROW section for each content block. --> <tr> <td align='center' valign='top'> <!-- CENTERING TABLE // --> <table border='0' cellpadding='0' cellspacing='0' width='100%'> <tr> <td align='center' valign='top'> <!-- FLEXIBLE CONTAINER // --> <table border='0' cellpadding='0' cellspacing='0' width='500' class='flexibleContainer'> <tr> <td align='center' valign='top' width='500' class='flexibleContainerCell'> <table border='0' cellpadding='30' cellspacing='0' width='100%'> <tr> <td valign='top' bgcolor='#E1E1E1'> <div style='font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#828282;text-align:center;line-height:120%;'> <div>Copyright © " + moment().format('YYYY') +" <a href='https://www.travellerspass.com' target='_blank' style='text-decoration:none;color:#828282;'><span style='color:#828282;'>Travellerspass</span></a>. All rights reserved.</div> <!--div>If you do not want to receive emails from us, you can <a href='#' target='_blank' style='text-decoration:none;color:#828282;'><span style='color:#828282;'>unsubscribe</span></a>.</div--> </div> </td> </tr> </table> </td> </tr> </table> <!-- // FLEXIBLE CONTAINER --> </td> </tr> </table> <!-- // CENTERING TABLE --> </td> </tr> </table> <!-- // END --> </td> "

    let tableclose: string = "</tr></table> "

    let centerclose: string = "</center>"

    let bodyclose: string = "</body>"

    let htmlclose: string = "</html>"

    return itineraryrowclose + emailbodyclose + emailfooter + tableclose + centerclose + bodyclose + htmlclose;
  }

  async sendMail() {
    if (this.emailId.valid) {
      this.emailPayload.toemail = this.emailId.value;
      this.emailPayload.mailcontent = this.openContent() + this.itinerary + this.closeContent();
      this.store.dispatch(new SendEmail(this.emailPayload));
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  getMailID(evt: CustomEvent) {
    this.emailId.patchValue(evt.detail.value);
  }

}


  // "toemail": "kskarthick93@gmail.com",
  // "ccemail": "support@tripmidas.com,operations@tripmidas.com",
  // "bccemail": "nadesan@tripmidas.com",
  // "subject": "Your itineraries for Flight",
  // "mailcontent": ""

// bccemail: "nadesan@tripmidas.com",
//   ccemail : "support@tripmidas.com,operations@tripmidas.com",
//     mailcontent : "",
//       subject : "Your itineraries for Flight",
//         toemail : "kskarthick93@gmail.com"
 