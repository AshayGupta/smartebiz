import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServiceListDetailPage } from './service-list-detail';
import { ComponentsModule } from '../../../../common/components/components.module';

@NgModule({
  declarations: [
    ServiceListDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ServiceListDetailPage),
    ComponentsModule
  ],
})
export class ServiceListDetailPageModule {}
