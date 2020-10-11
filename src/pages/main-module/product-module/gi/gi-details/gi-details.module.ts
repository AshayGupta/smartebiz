import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GiDetailsPage } from './gi-details';
import { GiAccountDetailsService } from '../../../../../providers/services/main-module-services/product-services/gi-services/gi-tabs/gi-account-details.service';
import { GIDetailsService } from '../../../../../providers/services/main-module-services/product-services/gi-services/gi-tabs/gi-details.service';
import { AccountDetailsPageModule } from '../../account-details/account-details.module';

@NgModule({
  declarations: [
    GiDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(GiDetailsPage),
    AccountDetailsPageModule,
  ],
  providers: [
    GiAccountDetailsService,
    GIDetailsService,
  ]
})
export class GiDetailsPageModule {}
