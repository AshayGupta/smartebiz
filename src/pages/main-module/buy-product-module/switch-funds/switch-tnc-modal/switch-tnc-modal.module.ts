import { ComponentsModule } from './../../../../../common/components/components.module';
import { PipesModule } from './../../../../../common/pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SwitchTncModalPage } from './switch-tnc-modal';

@NgModule({
  declarations: [
    SwitchTncModalPage,
  ],
  imports: [
    IonicPageModule.forChild(SwitchTncModalPage),
    ComponentsModule,
    PipesModule
  ],
})
export class SwitchTncModalPageModule {}
