import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddNewBankPage } from './add-new-bank';
import { ComponentsModule } from '../../../../../../common/components/components.module';
import { BankDetailsService } from '../../../../../../providers/services/main-module-services/bank-module-services/get-bank-details.service';
import { AmcMongoStagesService } from '../../../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';

@NgModule({
  declarations: [
    AddNewBankPage,
  ],
  imports: [
    IonicPageModule.forChild(AddNewBankPage),
    ComponentsModule
  ],
  providers:[
    BankDetailsService,
    AmcMongoStagesService
  ]
})
export class AddNewBankPageModule {}
