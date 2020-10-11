import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-withdraw-tnc-modal',
  templateUrl: 'withdraw-tnc-modal.html',
})
export class WithdrawTncModalPage {
  headerTitle: string = 'Terms And Conditions';
  terms: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WithdrawTncModalTsPage');
    this.terms = this.navParams.get('tnc');
  }

}
