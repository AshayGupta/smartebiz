import { ComponentsModule } from './../../../common/components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TncPage } from './tnc';

@NgModule({
  declarations: [
    TncPage,
  ],
  imports: [
    IonicPageModule.forChild(TncPage),
    ComponentsModule
  ],
})
export class TncPageModule {}
