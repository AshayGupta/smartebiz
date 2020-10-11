import { ComponentsModule } from './../../../common/components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AboutUsPage } from './about-us';
import { PipesModule } from '../../../common/pipes/pipes.module';

@NgModule({
  declarations: [
    AboutUsPage,
  ],
  imports: [
    IonicPageModule.forChild(AboutUsPage),
    ComponentsModule,
    PipesModule
  ],
})
export class AboutUsPageModule {}
