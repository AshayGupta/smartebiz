import { GetAccountBeneficiariesService } from '../../../../../../providers/services/main-module-services/product-services/pension-services/get-account-beneficiary.service';
import { ComponentsModule } from '../../../../../../common/components/components.module';
import { ModifyBeneficiaryPageModule } from '../modify-beneficiary/modify-beneficiary.module';
import { AddBeneficiaryPageModule } from '../add-beneficiary/add-beneficiary.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BeneficiaryDetailsPage } from './beneficiary-details';
import { ManageCollectionPensionService } from '../../../../../../providers/services/main-module-services/product-services/pension-services/get-manageCollection-pension.service';
import { GetPensionAccountDetailsService } from '../../../../../../providers/services/main-module-services/product-services/pension-services/pension-details/get-pension-account-details.service';

@NgModule({
  declarations: [
    BeneficiaryDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(BeneficiaryDetailsPage),
    ComponentsModule,
    ModifyBeneficiaryPageModule,
    AddBeneficiaryPageModule
  ],
  providers:[
    GetAccountBeneficiariesService,
    ManageCollectionPensionService,
    GetPensionAccountDetailsService
  ]
})
export class BeneficiaryDetailsPageModule {}
