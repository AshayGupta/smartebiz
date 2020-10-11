import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';

/**
 * Generated class for the TopUpTncModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-top-up-tnc-modal',
  templateUrl: 'top-up-tnc-modal.html',
})
export class TopUpTncModalPage {
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
    console.log('ionViewDidLoad TopUpTncModalPage');
    this.terms=this.navParams.get('tnc');
  }

}
