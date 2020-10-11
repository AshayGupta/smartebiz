import { WelcomePage } from './../../common-pages/welcome/welcome';
import { LocalStorageKey, ClientDetailsStorageKey } from './../../../common/enums/enums';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { PageTrack } from '../../../common/decorators/page-track';

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-thank-you-signup',
  templateUrl: 'thank-you-signup.html',
})
export class ThankYouSignupPage {

  email: string;
  password: string;
  headerTitle: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ThankYouSignupPage');
    this.setupPage();
  }

  setupPage() {
    this.viewCtrl.showBackButton(false);
    this.email = localStorage.getItem(ClientDetailsStorageKey.Email);
    this.password = this.navParams.get('password');
    this.headerTitle = this.navParams.get('headerTitle')
  }

  goToWelcomePage() {
    this.navCtrl.setRoot(WelcomePage);
  }

}
