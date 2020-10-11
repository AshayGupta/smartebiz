import { AddBeneficiaryService } from './../../../../../../providers/services/main-module-services/product-services/pension-services/add-beneficiary.service';
import { VerifyBeneficiaryPageModule } from './../verify-beneficiary/verify-beneficiary.module';
import { ComponentsModule } from './../../../../../../common/components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModifyBeneficiaryPage } from './modify-beneficiary';
import { GetTransactionNumberService } from '../../../../../../providers/services/main-module-services/buy-product-module-services/get-transaction-number.service';

@NgModule({
  declarations: [
    ModifyBeneficiaryPage,
  ],
  imports: [
    IonicPageModule.forChild(ModifyBeneficiaryPage),
    ComponentsModule,
    VerifyBeneficiaryPageModule
  ],
  providers:[
    AddBeneficiaryService,
    GetTransactionNumberService
  ]
})
export class ModifyBeneficiaryPageModule {}
