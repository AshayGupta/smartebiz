import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentMethodPage } from './payment-method';
import { ComponentsModule } from '../../../../common/components/components.module';
import { AlertService } from '../../../../providers/plugin-services/alert.service';

@NgModule({
  declarations: [
    PaymentMethodPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentMethodPage),
    ComponentsModule
  ],
  providers: [
    AlertService
  ],
  exports:[
    PaymentMethodPage
  ]
})
export class PaymentMethodPageModule {}
