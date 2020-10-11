import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InitialWithdrawTncPage } from './initial-withdraw-tnc';
import { ComponentsModule } from '../../../../../../common/components/components.module';
import { PipesModule } from '../../../../../../common/pipes/pipes.module';

@NgModule({
  declarations: [
    InitialWithdrawTncPage,
  ],
  imports: [
    IonicPageModule.forChild(InitialWithdrawTncPage),
    ComponentsModule,
    PipesModule
  ],
})
export class InitialWithdrawTncPageModule {}
