import { GetProductService } from '../../../../../providers/services/main-module-services/buy-product-module-services/get-product.service';
import { ComponentsModule } from '../../../../../common/components/components.module';
import { KnowYourCustomerPageModule } from '../know-your-customer/know-your-customer.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MarketFundsPage } from './market-funds';

@NgModule({
  declarations: [
    MarketFundsPage,
  ],
  imports: [
    IonicPageModule.forChild(MarketFundsPage),
    KnowYourCustomerPageModule,
    ComponentsModule
  ],
  providers:[GetProductService]
})
export class MarketFundsPageModule {}
