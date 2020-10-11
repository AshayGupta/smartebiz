import { ClientDetailsStorageKey } from './../../../../common/enums/enums';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RaiseRequestPage } from '../raise-request/raise-request';
import { LogonService } from '../../../../providers/services/auth/logon.service';
import { LocalStorageKey } from '../../../../common/enums/enums';
import { ServiceHistoryListService } from './../../../../providers/services/main-module-services/service-request-services/get-service-request.service';
import { ServiceHistoryResp, ServiceHistoryReq, ServiceHistoryList } from './../../../../dataModels/service-request.model';
import { ServiceListDetailPage } from '../service-list-detail/service-list-detail';
import { ClientDetailsReq, ClientDetailsResp } from '../../../../dataModels/client-details.model';
import { ClientDetailsService } from '../../../../providers/services/main-module-services/product-services/client-details.service';
import { CustomFirebaseAnalyticsProvider } from '../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { PageTrack } from '../../../../common/decorators/page-track';
import { GetSRStatusService } from '../../../../providers/services/main-module-services/service-request-services/get-SR-status.service';
import { SRStatusResp, SRStatusReq } from '../../../../dataModels/sr-status.model';

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-service-requests-list',
  templateUrl: 'service-requests-list.html',
})
export class ServiceRequestsListPage {

  serviceHistoryList: ServiceHistoryList[] = [];
  headerTitle: string = 'My Activity';
  inboxIcon: string = 'assets/imgs/Inbox.png';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public serviceHistoryService: ServiceHistoryListService,
    public logonService: LogonService,
    public clientDetailsService: ClientDetailsService,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider,
    private srStatusService: GetSRStatusService
  ) {
  } 

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceRequestsListPage');
    this.getServiceRequestList(); 

    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('ServiceRequestsListPage');
  }

  getServiceRequestList() {
    let req = new ServiceHistoryReq();
    req.nationalId = localStorage.getItem(LocalStorageKey.NationalID);
    req.nationalIdType = localStorage.getItem(LocalStorageKey.NationalIDType);

    this.serviceHistoryService.getServiceHistoryList(req, (resp: ServiceHistoryResp) => {
      this.serviceHistoryList = resp.serviceHistoryList.reverse();

      this.serviceHistoryList.filter((item, i) => {
        if (item.srNumber) {
          this.getSRStatus(item, i).then((obj: any) => {
            this.serviceHistoryList[obj.index].srStatus = obj.resp.status;
          });
        }
      })
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getServiceRequestList();
          }
        })
      });
  }

  getSRStatus(item: ServiceHistoryList, index) {
    return new Promise((resolve, reject) => {
      let req = new SRStatusReq();
      req.SRNumber = item.srNumber;
      req.lobSrc = item.lob;
  
      this.srStatusService.getSRStatus(req, (resp: SRStatusResp) => {
        resolve({resp: resp, index: index});
      },
        (err: boolean) => {
          // this.logonService.getToken((isTokenValid: boolean) => {
          //   if (isTokenValid) {
          //     this.getSRStatus(item, index);
          //   }
          // })
          reject(index);
        });
    });
  }

  serviceListDetails(list: ServiceHistoryList) {
    this.navCtrl.push(ServiceListDetailPage, { 'listData': list });
  }

  createRequest(event?: any) {
    this.navCtrl.push(RaiseRequestPage)
  }

}
