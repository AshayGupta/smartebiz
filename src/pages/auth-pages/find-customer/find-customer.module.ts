import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FindCustomerPage } from './find-customer';
import { ComponentsModule } from '../../../common/components/components.module';

@NgModule({
  declarations: [
    FindCustomerPage,
  ],
  imports: [
    IonicPageModule.forChild(FindCustomerPage),
    ComponentsModule
  ],
})
export class FindCustomerPageModule {}
