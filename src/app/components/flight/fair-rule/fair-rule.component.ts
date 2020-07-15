import { Component, OnInit, Input, ViewChild, ElementRef, SecurityContext } from '@angular/core';
import { FlightService } from 'src/app/services/flight/flight.service';
import { fareRule } from 'src/app/stores/result/flight.state';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-fair-rule',
  templateUrl: './fair-rule.component.html',
  styleUrls: ['./fair-rule.component.scss'],
})
export class FairRuleComponent implements OnInit {

  @ViewChild('template', { static : true, read : ElementRef }) template: ElementRef;

  @Input() fareRule: fareRule;
  htmlTemplate: SafeHtml = null;

  constructor(
    public modalCtrl : ModalController,
    private flightService : FlightService,
    public domSantizier : DomSanitizer
  ) { }

  async ngOnInit() {
    try {
      const fareRuleResponse = await (await this.flightService.fairRule(this.fareRule)).data;
      console.log(fareRuleResponse);
      const fairRuleTemplate = JSON.parse(fareRuleResponse).response.FareRules[0].FareRuleDetail;
      console.log(fairRuleTemplate);
      const sanitizedTemplate = this.domSantizier.sanitize(SecurityContext.HTML, fairRuleTemplate);
      console.log(sanitizedTemplate);
      this.htmlTemplate = sanitizedTemplate;
      console.log(this.htmlTemplate);
    }
    catch (error) {
      console.log(error);
    }
  }

  dismissFareRule() {
    this.modalCtrl.dismiss();
  }

}
