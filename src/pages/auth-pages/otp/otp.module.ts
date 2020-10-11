import { SwitchThankyouPageModule } from './../../main-module/buy-product-module/switch-funds/switch-thankyou/switch-thankyou.module';
import { GetPdfFileAsBase64Service } from './../../../providers/services/main-module-services/buy-product-module-services/get-pdf-file-as-base64.service';
import { CreateSrPdfService } from './../../../providers/services/main-module-services/buy-product-module-services/create-sr-pdf.service';
import { CategoryMatrixService } from './../../../providers/services/main-module-services/service-request-services/get-category-matrix.service';
import { RaiseRequestService } from './../../../providers/services/main-module-services/service-request-services/raise-service-request.service';
import { CreateTransactionService } from './../../../providers/services/main-module-services/buy-product-module-services/create-transaction.service';
import { WithdrawThankyouPageModule } from './../../main-module/buy-product-module/withdraw-funds/withdraw-thankyou/withdraw-thankyou.module';
import { PensionThankYouPageModule } from '../../main-module/product-module/pension/beneficiary/pension-thank-you/pension-thank-you.module';
import { ComponentsModule } from './../../../common/components/components.module';
import { VerifyOtpService } from './../../../providers/services/auth/verify-otp.service';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OtpPage } from './otp';
import { OtpService } from '../../../providers/services/auth/otp.service';
import { AdvanceQuoteService } from '../../../providers/services/main-module-services/loan-module-services/advance-quote.service';
import { ProcessPartialWithdrawalService } from '../../../providers/services/main-module-services/partial-withdraw-module-services/process-partial-withdrawal.service';
import { PipesModule } from '../../../common/pipes/pipes.module';
import { ThankYouPageModule } from '../../common-pages/thank-you/thank-you.module';
import { FindMeService } from '../../../providers/services/auth/findMe.service';
import { FinalDocProcessService } from '../../../providers/services/main-module-services/buy-product-module-services/final-doc-process.service';
import { CreateSwitchOrderService } from '../../../providers/services/main-module-services/buy-product-module-services/create-switch-order.service';
import { InitialWithdrawThankyouPageModule } from '../../main-module/product-module/pension/initial-withdraw-module/initial-withdraw-thankyou/initial-withdraw-thankyou.module';

@NgModule({
  declarations: [
    OtpPage,
  ],
  imports: [
    IonicPageModule.forChild(OtpPage),
    ComponentsModule,
    PipesModule,
    ThankYouPageModule,
    PensionThankYouPageModule,
    WithdrawThankyouPageModule,
    SwitchThankyouPageModule,
    InitialWithdrawThankyouPageModule
  ],
  providers: [
    OtpService,
    VerifyOtpService,
    AdvanceQuoteService,
    ProcessPartialWithdrawalService,
    FindMeService,
    CreateTransactionService,
    RaiseRequestService,
    CategoryMatrixService,
    CreateSrPdfService,
    GetPdfFileAsBase64Service,
    FinalDocProcessService,
    CreateSwitchOrderService
  ]
})
export class OtpPageModule {}
