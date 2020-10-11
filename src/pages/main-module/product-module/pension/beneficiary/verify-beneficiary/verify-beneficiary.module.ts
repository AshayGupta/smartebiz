import { OtpPageModule } from './../../../../../auth-pages/otp/otp.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerifyBeneficiaryPage } from './verify-beneficiary';
import { ComponentsModule } from '../../../../../../common/components/components.module';
import { ClientDetailsService } from '../../../../../../providers/services/main-module-services/product-services/client-details.service';
import { HtmlContentService } from '../../../../../../providers/services/common-pages/html-content.service';

@NgModule({
  declarations: [
    VerifyBeneficiaryPage,
  ],
  imports: [
    IonicPageModule.forChild(VerifyBeneficiaryPage),
    ComponentsModule,
    OtpPageModule
  ],
  providers: [
    ClientDetailsService,
    HtmlContentService
  ]
})
export class VerifyBeneficiaryPageModule {}
