import { ServiceRequestsListPage } from './../service-requests-list/service-requests-list';
import { RaiseRequestService } from '../../../../providers/services/main-module-services/service-request-services/raise-service-request.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertService } from '../../../../providers/plugin-services/alert.service';
import { LogonService } from '../../../../providers/services/auth/logon.service';
import { RaiseServiceRequestReq, RaiseServiceRequestResp } from '../../../../dataModels/raise-service-request.model';
import { ThankYouPage } from '../../../common-pages/thank-you/thank-you';
import { StatusCode } from '../../../../common/enums/enums';
import { CustomFirebaseAnalyticsProvider } from '../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { PageTrack } from '../../../../common/decorators/page-track';

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-raise-request-confirm',
  templateUrl: 'raise-request-confirm.html',
})
export class RaiseRequestConfirmPage {

  raiseServiceReq = new RaiseServiceRequestReq();
  headerTitle: string = 'Raise Request';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public logonService: LogonService,
    public alert: AlertService,
    public raiseServiceReqService: RaiseRequestService,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider
  ) {
    this.raiseServiceReq = navParams.get('raiseReqData');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RaiseRequestConfirmPage');

      // Firebase Analytics 'screen_view' event tracking
      this.customFirebaseAnalytics.trackView('RaiseRequestConfirmPage');
  }

  submitRequestClicked() {
    this.raiseServiceReqService.addServiceRequest(this.raiseServiceReq, (resp: RaiseServiceRequestResp) => {
      // this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.getActive().index - 2));

      this.navCtrl.push(ThankYouPage, { 'result': resp.srNumber }).then(() => {
        this.navCtrl.remove(1, this.navCtrl.getActive().index - 1);
        this.navCtrl.insert(1, ServiceRequestsListPage);
      });
    },
      (error) => {
        if (error.status == StatusCode.Status403) {
          this.logonService.getToken((isTokenValid: boolean) => {
            if (isTokenValid) {
              this.submitRequestClicked();
            }
          })
        }
        else {
          let alertTitle = "";
          let alertMsg = "Some error occured during processing the request, please try after some time";
          let cancelTxt = "";
          let successTxt = "OK";
      
          this.alert.Alert.alert(alertMsg, alertTitle, cancelTxt, successTxt).then(res => {
          });
        }

      });
  }

  editRequest() {
    this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.getActive().index - 1));
  }

  deleteRequest() {
    let msg = 'Do you really want to cancel your request?';
    let title = '<span style="color:red">You are almost done!</span>';
    let cancelText = 'NO';
    let successText = 'YES';

    this.alert.Alert.confirm(msg, title, cancelText, successText).then((res) => {
      this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.getActive().index - 2));
    }, err => {
      console.log('user cancelled');
    })
  }

}


