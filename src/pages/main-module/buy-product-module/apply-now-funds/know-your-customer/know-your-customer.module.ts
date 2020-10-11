import { ComponentsModule } from './../../../../../common/components/components.module';
import { PersonalDetailsPageModule } from './../personal-details/personal-details.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { KnowYourCustomerPage } from './know-your-customer';
import { GetContactService } from '../../../../../providers/services/main-module-services/buy-product-module-services/get-contacts.service';

@NgModule({
  declarations: [
    KnowYourCustomerPage,
  ],
  imports: [
    IonicPageModule.forChild(KnowYourCustomerPage),
    PersonalDetailsPageModule,
    ComponentsModule
  ],
  providers:[
    GetContactService
  ]
})
export class KnowYourCustomerPageModule {}
