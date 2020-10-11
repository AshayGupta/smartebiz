import { AccountsCountService } from './../../../../providers/services/main-module-services/product-services/get-products-count';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardPage } from './dashboard';
import { ComponentsModule } from '../../../../common/components/components.module';
import { ClientDetailsService } from '../../../../providers/services/main-module-services/product-services/client-details.service';

@NgModule({
  declarations: [
    DashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(DashboardPage),
    ComponentsModule
  ],
  providers: [
    AccountsCountService,
    ClientDetailsService
  ]
})
export class DashboardPageModule { }
