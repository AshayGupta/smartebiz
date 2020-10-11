import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';

/**
 * Generated class for the SwitchTncModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-switch-tnc-modal',
  templateUrl: 'switch-tnc-modal.html',
})
export class SwitchTncModalPage {
  headerTitle: string = 'Terms And Conditions';
  terms:string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    ) {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SwitchTncModalPage');
    this.terms=this.navParams.get('tnc');
  }

}
