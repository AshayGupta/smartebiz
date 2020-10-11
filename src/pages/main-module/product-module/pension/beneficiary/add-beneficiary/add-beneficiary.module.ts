import { AddNomineePageModule } from './../add-nominee/add-nominee.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddBeneficiaryPage } from './add-beneficiary';
import { ComponentsModule } from '../../../../../../common/components/components.module';
import { CountryCodeService } from '../../../../../../providers/services/common-pages/country-code.service';
import { UploadDocumentService } from '../../../../../../providers/services/main-module-services/upload-doc.service';

@NgModule({
  declarations: [
    AddBeneficiaryPage,
  ],
  imports: [
    IonicPageModule.forChild(AddBeneficiaryPage),
    ComponentsModule,
    AddNomineePageModule
  ],
  providers: [
    CountryCodeService,
    UploadDocumentService
  ]
})
export class AddBeneficiaryPageModule {}
