import { HtmlContentService } from './../../../../../providers/services/common-pages/html-content.service';
import { VerifyFundsPage } from './verify-funds';
import { ComponentsModule } from './../../../../../common/components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FundsPaymentMethodPageModule } from '../funds-payment-method/funds-payment-method.module';
import { AmcMongoStagesService } from '../../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';
import { OnboardingTncModalPageModule } from './../onboarding-tnc-modal/onboarding-tnc-modal.module';

@NgModule({
  declarations:[
    VerifyFundsPage
  ],
  imports:[
    IonicPageModule.forChild(VerifyFundsPage),
    ComponentsModule,
    OnboardingTncModalPageModule,
    FundsPaymentMethodPageModule,
  ],
  providers:[
    AmcMongoStagesService,HtmlContentService
  ]
})
export class VerifyFundsPageModule{}
