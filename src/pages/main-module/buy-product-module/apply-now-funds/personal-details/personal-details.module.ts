import { IprsService } from './../../../../../providers/services/main-module-services/buy-product-module-services/iprs-check.service';
import { ComponentsModule } from './../../../../../common/components/components.module';
import { PersonalDetailsPage } from './personal-details';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BankDetailsPageModule } from '../bank-details/bank-details.module';
import { CountryCodeService } from '../../../../../providers/services/common-pages/country-code.service';
import { AmcMongoStagesService } from '../../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';

@NgModule({
  declarations:[
    PersonalDetailsPage
  ],
  imports:[
    IonicPageModule.forChild(PersonalDetailsPage),
    BankDetailsPageModule,
    ComponentsModule
  ],
  providers:[
    IprsService,
    CountryCodeService,
    AmcMongoStagesService
  ]
})
export class PersonalDetailsPageModule{}
