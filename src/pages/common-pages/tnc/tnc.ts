import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-tnc',
  templateUrl: 'tnc.html',
})
export class TncPage {

  headerTitle: string = "Term & Conditions";
  htmlContent:"<h1>dummy content</h1>"
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TncPage');
  }

}
