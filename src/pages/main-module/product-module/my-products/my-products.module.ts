import { AmcAccountHoldingsService } from './../../../../providers/services/main-module-services/product-services/amc-services/amc-tabs/amc-account-holdings.service';
import { PensionDetailsPageModule } from './../pension/pension-details/pension-details.module';
import { NgModule } from "@angular/core";
import { MyProductsPage } from "./my-products";
import { IonicPageModule } from "ionic-angular";
import { ComponentsModule } from "../../../../common/components/components.module";
import { PayNowScreenPageModule } from '../../pay-now-module/pay-now-screen/pay-now-screen.module';
import { GetAllAccountsService } from "../../../../providers/services/main-module-services/product-services/all-accounts.service";
import { MyProductScreenPageModule } from "../my-product-screen/my-product-screen.module";
import { LifeDetailsPageModule } from "../life/life-details/life-details.module";
import { GiDetailsPageModule } from "../gi/gi-details/gi-details.module";
import { AmcDetailsPageModule } from "../amc/amc-details/amc-details.module";
import { ActionItemsService } from "../../../../providers/services/main-module-services/product-services/action-items-services";
import { PensionPaynowPageModule } from '../../pay-now-module/pension-paynow/pension-paynow.module';
import { GetPensionAccountDetailsService } from '../../../../providers/services/main-module-services/product-services/pension-services/pension-details/get-pension-account-details.service';


@NgModule({
  declarations: [
    MyProductsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyProductsPage),
    ComponentsModule,
    PayNowScreenPageModule,
    PensionPaynowPageModule,
    LifeDetailsPageModule,
    GiDetailsPageModule,
    AmcDetailsPageModule,
    MyProductScreenPageModule,
    PensionDetailsPageModule
  ],
  providers: [
    GetAllAccountsService,
    ActionItemsService,
    AmcAccountHoldingsService,
    GetPensionAccountDetailsService
  ]
})
export class MyProductsPageModule { }
