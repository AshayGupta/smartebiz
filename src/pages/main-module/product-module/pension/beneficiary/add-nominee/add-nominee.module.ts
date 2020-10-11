import { ComponentsModule } from './../../../../../../common/components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddNomineePage } from './add-nominee';
import { CountryCodeService } from '../../../../../../providers/services/common-pages/country-code.service';
import { UploadDocumentService } from '../../../../../../providers/services/main-module-services/upload-doc.service';

@NgModule({
  declarations: [
    AddNomineePage,
  ],
  imports: [
    IonicPageModule.forChild(AddNomineePage),
    ComponentsModule
  ],
  providers: [
    CountryCodeService,
    UploadDocumentService
  ]
})
export class AddNomineePageModule {}
