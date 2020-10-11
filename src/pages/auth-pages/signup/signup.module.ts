import { ComponentsModule } from './../../../common/components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignupPage } from './signup';
import { SignupService } from '../../../providers/services/auth/signup.service';
import { FindCustomerPageModule } from '../find-customer/find-customer.module';

@NgModule({
  declarations: [
    SignupPage,
  ],
  imports: [
    IonicPageModule.forChild(SignupPage),
    ComponentsModule,
    FindCustomerPageModule
  ],
  providers: [
    SignupService,
  ]
})
export class SignupPageModule {}
