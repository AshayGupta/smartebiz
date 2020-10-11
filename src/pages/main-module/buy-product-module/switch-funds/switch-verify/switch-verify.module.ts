import { TransactionCharges } from './../../../../../providers/services/main-module-services/buy-product-module-services/get-transaction-charges.service';
import { AmcMongoStagesService } from './../../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';
import { SwitchTncModalPageModule } from './../switch-tnc-modal/switch-tnc-modal.module';
import { HtmlContentService } from './../../../../../providers/services/common-pages/html-content.service';
import { ComponentsModule } from './../../../../../common/components/components.module';
import { SwitchThankyouPageModule } from './../switch-thankyou/switch-thankyou.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SwitchVerifyPage } from './switch-verify';

@NgModule({
  declarations: [
    SwitchVerifyPage,
  ],
  imports: [
    IonicPageModule.forChild(SwitchVerifyPage),
    ComponentsModule,
    SwitchTncModalPageModule,
    SwitchThankyouPageModule
  ],
  providers:[
    HtmlContentService,
    AmcMongoStagesService,
    TransactionCharges
  ]
})
export class SwitchVerifyPageModule {}
