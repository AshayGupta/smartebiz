import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-life-view-history',
  templateUrl: 'life-view-history.html',
})
export class LifeViewHistoryPage {

  activity = [];
  num:string;
  len:number;
  doHaveComment:boolean=true;
  headerTitle = "View Comment";
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.activity = this.navParams.get('activity');
    this.num=this.navParams.get('srno');
    this.len=this.navParams.get('length');

    console.log(this.activity);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LifeViewHistoryPage');
    this.checkComment();
  }

  checkComment(){
    if(this.len == 0){
      this.doHaveComment=false;
    }
    else{
      this.doHaveComment=true;
    }
  }

}