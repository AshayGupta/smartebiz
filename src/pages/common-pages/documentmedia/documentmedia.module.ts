import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DocumentMediaPage } from './documentmedia';
import { DocumentMediaService } from '../../../providers/services/common-pages/document-media.service';
import { ComponentsModule } from '../../../common/components/components.module';

@NgModule({
  declarations: [
    DocumentMediaPage,
  ],
  imports: [
    IonicPageModule.forChild(DocumentMediaPage),
    ComponentsModule
  ],
  providers: [
    DocumentMediaService
  ]
})
export class DocumentmediaPageModule {}
