import { ComponentsModule } from './../../../common/components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuyOnlinePage } from './buy-online';
import { ProductCatalogService } from '../../../providers/services/common-pages/product-catalog.service';
import { MarketFundsPageModule } from '../../main-module/buy-product-module/apply-now-funds/market-funds/market-funds.module';

@NgModule({
  declarations: [
    BuyOnlinePage,
  ],
  imports: [
    IonicPageModule.forChild(BuyOnlinePage),
    ComponentsModule,
    MarketFundsPageModule
  ],
  providers: [
    ProductCatalogService
  ]
})
export class BuyOnlinePageModule { }
