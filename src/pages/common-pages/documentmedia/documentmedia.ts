import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LogonService } from '../../../providers/services/auth/logon.service';
import { DocumentMediaService } from '../../../providers/services/common-pages/document-media.service';
import { DocumentMediaReq, DocumentMediaResp, MediaDetails } from '../../../dataModels/document-media.model';
import { ApiUrl } from '../../../common/constants/constants';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { HttpErrorResponse } from '@angular/common/http';
import { StatusCode } from '../../../common/enums/enums';


@IonicPage()
@Component({
  selector: 'page-documentmedia',
  templateUrl: 'documentmedia.html',
})
export class DocumentMediaPage {

  headerTitle = "Forms and Documents";
  mediaDetails: MediaDetails;
  isResponseReceived: boolean;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public documentMedia: DocumentMediaService,
    public logonService: LogonService,
    private iab: InAppBrowser,
  ) {
    this.mediaDetails = new MediaDetails();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DocumentMediaPage');
    this.getDocumentMedia();
  }

  getDocumentMedia() {
    let reqData = new DocumentMediaReq();
    reqData = "";

    this.documentMedia.getDocument(reqData, (resp: DocumentMediaResp) => {
      this.mediaDetails = resp.media;

      if (this.mediaDetails.gi.length == 0 && this.mediaDetails.life.length == 0 && this.mediaDetails.pension.length == 0) {
        this.isResponseReceived = true;
      }
    },
      (err: HttpErrorResponse) => {
        this.isResponseReceived = true;
        
        if (err.status == StatusCode.Status403) {
          this.logonService.getToken((isTokenValid: boolean) => {
            if (isTokenValid) {
              this.getDocumentMedia();
            }
          });
        }
      });
  }

  downloadDoc(url: string) {
    let downloadUrl: string = ApiUrl.profileImgUrl + url;

    console.log('downloadDoc url ->', downloadUrl);

    let opts: string = "location=yes,clearcache=yes,hidespinner=no"
    this.iab.create(downloadUrl, '_system', opts);
  }

}