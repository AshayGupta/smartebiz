import { ComponentsModule } from './../../../common/components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LearnHowPage } from './learn-how';
import { PipesModule } from '../../../common/pipes/pipes.module';

@NgModule({
  declarations: [
    LearnHowPage,
  ],
  imports: [
    IonicPageModule.forChild(LearnHowPage),
    ComponentsModule,
    PipesModule
  ],
})
export class LearnHowPageModule {}
