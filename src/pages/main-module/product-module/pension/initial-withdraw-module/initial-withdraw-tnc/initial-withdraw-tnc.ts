import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-initial-withdraw-tnc',
  templateUrl: 'initial-withdraw-tnc.html',
})
export class InitialWithdrawTncPage {

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
    console.log('ionViewDidLoad InitialWithdrawTncPage');
    this.terms = this.navParams.get('tnc');
  }

}
