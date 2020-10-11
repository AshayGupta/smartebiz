import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PageSegmentInterface } from '../../interfaces/page-segment.interface';


@Component({
  selector: 'page-segments',
  templateUrl: 'page-segments.html'
})
export class PageSegmentsComponent {

  @Output('segmentOutput') segmentOutput = new EventEmitter();
  segmentData: PageSegmentInterface[];
  segment = '';

  @Input('selectedSegmentName') selectedSegmentName: string;
  @Input()
  set segmentInput(data: PageSegmentInterface[]) {
    this.segmentData = data;
    this.segment = this.selectedSegmentName;
  }

  constructor() {
    console.log('Hello PageSegmentsComponent Component');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PageSegmentsComponent');
  }

  segmentBtnClicked(data: PageSegmentInterface) {
    this.segmentOutput.emit(data.selectedTag);
  }

}
