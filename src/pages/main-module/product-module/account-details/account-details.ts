import { ScreenOrientationService } from './../../../../providers/plugin-services/screen-orientation.service';
import { PageSegmentInterface } from './../../../../common/interfaces/page-segment.interface';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CustomFirebaseAnalyticsProvider } from '../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { PageTrack } from '../../../../common/decorators/page-track';

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-account-details',
  templateUrl: 'account-details.html',
})
export class AccountDetailsPage {

  @Input('productDetails') productDetails;
  @Output('accordionOutput') accordionOutput = new EventEmitter();

  segmentInput: PageSegmentInterface[] = [];
  detailObj = {};
  selectedTag: string;
  headerTitle: string = 'My Products';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private screenOrientationService: ScreenOrientationService, private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider
  ) {
  }

  ngOnInit() {
    // this.screenOrientationService.lockOrientation();
    console.log('ngOnInit', this.productDetails);

    this.segmentInput = this.productDetails.segmentList;
    this.detailObj = this.productDetails.detailObjs;

    this.selectedTag = this.segmentInput[0].selectedTag;
  }

  ngOnDestroy() {
    // this.screenOrientationService.unlockOrientation();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountDetailsPage');

    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('AccountDetailsPage');
  }

  accordionClicked(tag: string) {
    console.log(tag);
    this.selectedTag = tag;
    this.accordionOutput.emit(tag);
  }

  getSegment(selectedValue: string) {
    console.log('value: ', selectedValue);
  }

}
