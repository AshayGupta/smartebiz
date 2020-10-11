import { PensionPaynowThankyouPageModule } from './../pension-paynow-thankyou/pension-paynow-thankyou.module';
import { AmcMongoStagesService } from './../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';
import { CreateSrPdfService } from './../../../../providers/services/main-module-services/buy-product-module-services/create-sr-pdf.service';
import { ThankYouTopupPageModule } from './../../buy-product-module/topup-funds/thank-you-topup/thank-you-topup.module';
import { OnboardingThankyouPageModule } from './../../buy-product-module/apply-now-funds/onboarding-thankyou/onboarding-thankyou.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PayNowFinalPaymentPage } from './pay-now-final-payment';
import { PipesModule } from '../../../../common/pipes/pipes.module';
import { MakePaymentService } from '../../../../providers/services/main-module-services/pay-now-module-services/make-payment.service';
import { PayNowFinalSummaryPageModule } from '../pay-now-final-summary/pay-now-final-summary.module';
import { RaiseRequestService } from '../../../../providers/services/main-module-services/service-request-services/raise-service-request.service';

@NgModule({
  declarations: [
    PayNowFinalPaymentPage,
  ],
  imports: [
    IonicPageModule.forChild(PayNowFinalPaymentPage),
    PipesModule,
    PayNowFinalSummaryPageModule,
    OnboardingThankyouPageModule,
    ThankYouTopupPageModule,
    PensionPaynowThankyouPageModule
  ],
  providers: [MakePaymentService, RaiseRequestService,CreateSrPdfService,AmcMongoStagesService],

})
export class PayNowFinalPaymentPageModule { }
