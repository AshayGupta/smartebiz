import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';

/**
 * Generated class for the OnboardingTncModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-onboarding-tnc-modal',
  templateUrl: 'onboarding-tnc-modal.html',
})
export class OnboardingTncModalPage {
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
    console.log('ionViewDidLoad OnboardingTncModalPage');
    this.terms = this.navParams.get('tnc');
  }

}
