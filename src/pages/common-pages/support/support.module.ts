import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SupportPage } from './support';
import { ComponentsModule } from '../../../common/components/components.module';
import { CallNumber } from '@ionic-native/call-number';

@NgModule({
  declarations: [
    SupportPage,
  ],
  imports: [
    IonicPageModule.forChild(SupportPage),
    ComponentsModule,
  ],
  providers: [
    CallNumber
  ]
})
export class SupportPageModule {}
