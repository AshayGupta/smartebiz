import { PipesModule } from './../../../../../common/pipes/pipes.module';
import { ComponentsModule } from './../../../../../common/components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WithdrawTncModalPage } from './withdraw-tnc-modal';

@NgModule({
  declarations: [
    WithdrawTncModalPage,
  ],
  imports: [
    IonicPageModule.forChild(WithdrawTncModalPage),
    ComponentsModule,
    PipesModule
  ],
})
export class WithdrawTncModalPageModule {}
