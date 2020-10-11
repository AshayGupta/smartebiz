import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServiceRequestsListPage } from './service-requests-list';
import { RaiseRequestPageModule } from '../raise-request/raise-request.module';
import { ServiceHistoryListService } from '../../../../providers/services/main-module-services/service-request-services/get-service-request.service';
import { ComponentsModule } from '../../../../common/components/components.module';
import { ServiceListDetailPageModule } from '../service-list-detail/service-list-detail.module';
import { GetSRStatusService } from '../../../../providers/services/main-module-services/service-request-services/get-SR-status.service';


@NgModule({
  declarations: [
    ServiceRequestsListPage
  ],
  imports: [
    IonicPageModule.forChild(ServiceRequestsListPage),
    ComponentsModule,
    RaiseRequestPageModule,
    ServiceListDetailPageModule
  ],
  providers: [
    ServiceHistoryListService,
    GetSRStatusService
  ]
})
export class ServiceRequestsListPageModule { }
