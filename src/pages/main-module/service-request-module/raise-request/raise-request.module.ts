import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RaiseRequestPage } from './raise-request';
import { RaiseRequestConfirmPageModule } from '../raise-request-confirm/raise-request-confirm.module';
import { CategoryMatrixService } from '../../../../providers/services/main-module-services/service-request-services/get-category-matrix.service';
import { GetAllAccountsService } from '../../../../providers/services/main-module-services/product-services/all-accounts.service';
import { ComponentsModule } from '../../../../common/components/components.module';
import { ClientDetailsService } from '../../../../providers/services/main-module-services/product-services/client-details.service';
 
 
@NgModule({ 
  declarations: [
    RaiseRequestPage
  ],
  imports: [
    IonicPageModule.forChild(RaiseRequestPage),
    ComponentsModule,
    RaiseRequestConfirmPageModule     
  ],
  providers:[
    GetAllAccountsService,
    CategoryMatrixService,
    ClientDetailsService
  ]
})
export class RaiseRequestPageModule {}
