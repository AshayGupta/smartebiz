import { ComponentsModule } from './../../../common/components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FaqPage } from './faq';
import { PipesModule } from '../../../common/pipes/pipes.module';

@NgModule({
  declarations: [
    FaqPage,
  ],
  imports: [
    IonicPageModule.forChild(FaqPage),
    ComponentsModule,
    PipesModule
  ],
})
export class FaqPageModule {}
