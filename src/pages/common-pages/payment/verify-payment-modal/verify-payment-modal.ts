import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

export interface VerifyPaymentModalInterface {
  title?: String,
  message?: string,
  amount?: string,
  currency?: string,
  payVia?: string,
  buttonText?: string
}

@IonicPage()
@Component({
  selector: 'page-verify-payment-modal',
  templateUrl: 'verify-payment-modal.html',
})
export class VerifyPaymentModalPage {
  
  @Input('verifyPayment') verifyPayment: VerifyPaymentModalInterface;
  @Output('payClicked') payClicked = new EventEmitter();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerifyPaymentModalPage');
  }

  clickToPay() {
    this.payClicked.emit();
  }

}
