import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/models/user';
import { Subscription } from 'rxjs';
import { PickerController, ModalController } from '@ionic/angular';
import { CityModalComponent } from 'src/app/components/city-modal/city-modal.component';
import { OneWayTrip, searchTrip, Picker, City } from 'src/app/models/search';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

   //local variable
   user : User;
   trip : OneWayTrip;
   searchTrip : searchTrip;
   searchTripForm : FormGroup;
 
 
   //Subscription data
   userSub : Subscription;
   citySub : Subscription;
 
   constructor(
     public authService : AuthService,
     public pickerCtrl : PickerController,
     public modalCtrl : ModalController
   ) {
       this.trip = {
         origin : null,
         destination: null,
         departureDate : "2019-10-01T15:43:40.394Z",
         class : {
           columnData : [{
             name : 'Class',
             options : [
               {
                 text : "Economy",
                 value : 0
               },
               {
                 text : 'Premium',
                 value : 1
               },
               {
                 text : 'Premium Economy',
                 value : 2
               },
               {
                 text : 'First Class',
                 value : 3
               }
             ]
           }],
           buttonData : [
             {
               text: 'Cancel',
               role: 'cancel'
             },
             {
               text: 'Confirm',
               handler: (value) => {
                 console.log(value.Class.text,value.Class.value);
               }
             }
           ]
         },
         persons : {
           columnData : [{
             name : 'Person',
             options : [
               {
                 text : "1",
                 value : 1
               },
               {
                 text : '2',
                 value : 2
               },
               {
                 text : '3',
                 value : 3
               },
               {
                 text : '4',
                 value : 4
               },
               {
                 text : '5',
                 value : 5
               },
               {
                 text : '6',
                 value : 6
               }
             ]
           }],
           buttonData : [
             {
               text: 'Cancel',
               role: 'cancel'
             },
             
             {
               text: 'Confirm',
               handler: (value) => {
                 console.log(value.Person.text,value.Person.value);
               }
             }
           ]
         }
       }
    }
 
   ngOnInit() {
     this.userSub = this.authService.getUser.subscribe(
       (resData : User) => {
         this.user = resData;
       }
     );
     this.searchTripForm = new FormGroup({
      origin_city_code : new FormControl(),
      origin_city_name : new FormControl(),
      destination_city_code : new FormControl(),
      destination_city_name : new FormControl(),
      departure_date : new FormControl(),
      arrival_date  : new FormControl(),
      persons : new FormControl(),
      class : new FormControl()
     });
   }
 
   selectCity(location : City,point : string){
     this.getModal(location,point);
   }
 
   selectOrigin(){
     this.selectCity(this.trip.origin,"origin");
   }
 
   selectDestination(){
     this.selectCity(this.trip.destination,"destination");
   }
 
   selectTrip(evt){
     console.log(evt);
   }
 
   selectClass(){
     this.getPicker(this.trip.class);
   }
 
   selectPerson(){
     this.getPicker(this.trip.persons);
   }
 
   onSearchTrip(){
     console.log(this.searchTripForm);
   }
   
   getPicker(picker : Picker) {
     let pick = this.pickerCtrl.create({
       columns: picker.columnData,
       buttons: picker.buttonData
     }).then(
       (pickEl) => {
         pickEl.present();
         pickEl.onDidDismiss()
           .then(
             (pickerEl) => {
               pickerEl.data
             }
           );
       }
       );
     return pick;
   }
 
   getModal(location,point){
     let modal = this.modalCtrl.create({
       component : CityModalComponent,
       componentProps : {
         location: location,
         point : point
       }
     }).then(
       (modalEl) => {
         modalEl.present();
         modalEl.dismiss(
           (selectedCity : City,point : string) => {
             console.log(selectedCity,point);
             if(point == 'origin'){
               this.trip.origin = selectedCity;
             }
             else if(point == 'destination'){
               this.trip.destination = selectedCity;
             }
           }
         );
       }
     )
 
     return modal;
   }
 
   ngOnDestroy(){
     this.userSub.unsubscribe();
   }

}
