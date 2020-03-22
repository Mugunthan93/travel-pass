import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-passenger-modal',
  templateUrl: './passenger-modal.component.html',
  styleUrls: ['./passenger-modal.component.scss']
})
export class PassengerModalComponent implements OnInit, OnDestroy {
  
  @Input() currentPassengers: any;

  traveller : FormGroup;
  valSub : Subscription;

  constructor(
    public fb : FormBuilder,
    public modalCtrl : ModalController
  ) {
  }

  ngOnInit() {
    this.traveller = this.fb.group({
      adult: this.fb.control(0),
      child: this.fb.control(0),
      infant: this.fb.control(0)
    });

    if (this.currentPassengers !== null) {
      this.traveller.patchValue(this.currentPassengers);
    }

    this.traveller.valueChanges.subscribe(
      (values) => {
        console.log(values);
      }
    );
  }
  
  close() {
    this.modalCtrl.dismiss(this.traveller.value);
  }

  increase(person : string){
    let currentValue : number = this.traveller.controls[person].value;
    if(currentValue >= 0 && currentValue < 9){
      currentValue += 1;
      this.traveller.controls[person].patchValue(currentValue);
      console.log(this.traveller);
    }
    else{
      return;
    }
  }


  decrease(person : string){
    let currentValue : number = this.traveller.controls[person].value;
    if(currentValue > 0 && currentValue <= 9){
      currentValue -= 1;
      this.traveller.controls[person].patchValue(currentValue);
      console.log(this.traveller);
    }
    else{
      return;
    }
  }

  ngOnDestroy(){
    if(this.valSub){
      this.valSub.unsubscribe();
    }
  }

}
