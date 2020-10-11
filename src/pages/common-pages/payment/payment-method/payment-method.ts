import { Component, Output, EventEmitter, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MakePaymentReq, PaymentList } from '../../../../dataModels/make-payment.model';
import { AlertService } from '../../../../providers/plugin-services/alert.service';


@IonicPage()
@Component({
  selector: 'page-payment-method',
  templateUrl: 'payment-method.html',
})
export class PaymentMethodPage {

  headerTitle: string = 'Payment Method';
  isenabled: boolean=true;
  className: string='payment-card active';
  paymentOptions = {
    mpesa: "mpesa",
    bank: "bank"
  }
  paymentOptionSelected: string=this.paymentOptions.mpesa;

  @Input('amount') amount: string;
  @Output('payClicked') payClicked = new EventEmitter();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alert: AlertService,
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentMethodPage');
     //--Important-- Bydefault select Mpesa Option;Just remove defualt values when when Multiple payment option available
     //Remove Value of==> className, paymentOptionSelected, isenabled
  }

  selectPaymentOption(value) {
    console.log('payment event', value);
    this.paymentOptionSelected = value;

    if (value == this.paymentOptions.mpesa) {
      this.isenabled = true;
      this.className = 'payment-card active';
    } else {
      this.isenabled = false;
      this.className = 'payment-card';
    }
  }

  proceedToPay() {
    if (parseFloat(this.amount) > 70000 && this.paymentOptions.mpesa == this.paymentOptionSelected) {
      let msg = "M-Pesa doesn't support transactions that are above KES 70,000"
      let title = "Please Note";
      this.alert.Alert.alert(msg, title);
      return;
    }
    this.payClicked.emit(this.paymentOptionSelected);
  }

}
