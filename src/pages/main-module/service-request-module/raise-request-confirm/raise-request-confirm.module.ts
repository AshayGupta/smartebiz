import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RaiseRequestConfirmPage } from './raise-request-confirm';
import { RaiseRequestService } from '../../../../providers/services/main-module-services/service-request-services/raise-service-request.service';
import { ComponentsModule } from '../../../../common/components/components.module';

@NgModule({
  declarations: [
    RaiseRequestConfirmPage, 
  ],
  imports: [
    IonicPageModule.forChild(RaiseRequestConfirmPage),
    ComponentsModule,
  ],
  providers:[RaiseRequestService]
})
export class RaiseRequestConfirmPageModule {} 
