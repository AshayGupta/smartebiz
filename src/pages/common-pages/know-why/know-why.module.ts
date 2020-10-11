import { ComponentsModule } from './../../../common/components/components.module';
import { HtmlContentService } from './../../../providers/services/common-pages/html-content.service';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { KnowWhyPage } from './know-why';
import { PipesModule } from '../../../common/pipes/pipes.module';

@NgModule({
  declarations: [
    KnowWhyPage,
  ],
  imports: [
    IonicPageModule.forChild(KnowWhyPage),
    ComponentsModule,
    PipesModule
  ],
  providers: [
    HtmlContentService
  ]
})
export class KnowWhyPageModule {}
