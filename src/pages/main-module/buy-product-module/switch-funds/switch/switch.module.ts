import { GetTransactionNumberService } from './../../../../../providers/services/main-module-services/buy-product-module-services/get-transaction-number.service';
import { AmcMongoStagesService } from './../../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';
import { AlertService } from './../../../../../providers/plugin-services/alert.service';
import { ClientDetailsService } from './../../../../../providers/services/main-module-services/product-services/client-details.service';
import { AmcAccountHoldingsService } from './../../../../../providers/services/main-module-services/product-services/amc-services/amc-tabs/amc-account-holdings.service';
import { ComponentsModule } from './../../../../../common/components/components.module';
import { SwitchVerifyPageModule } from './../switch-verify/switch-verify.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SwitchPage } from './switch';
import { GetProductService } from '../../../../../providers/services/main-module-services/buy-product-module-services/get-product.service';

@NgModule({
declarations: [
SwitchPage,
],
imports: [
IonicPageModule.forChild(SwitchPage),
SwitchVerifyPageModule,
ComponentsModule
],
providers:[
AmcAccountHoldingsService,
ClientDetailsService,
AlertService,
AmcMongoStagesService,
GetTransactionNumberService,
GetProductService
]
})
export class SwitchPageModule {}
