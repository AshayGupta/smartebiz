import { PipesModule } from './../../../../../common/pipes/pipes.module';
import { ComponentsModule } from './../../../../../common/components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TopUpTncModalPage } from './top-up-tnc-modal';

@NgModule({
  declarations: [
    TopUpTncModalPage,
  ],
  imports: [
    IonicPageModule.forChild(TopUpTncModalPage),
    ComponentsModule,
    PipesModule
  ],
})
export class TopUpTncModalPageModule {}
