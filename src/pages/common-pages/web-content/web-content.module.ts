import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WebContentPage } from './web-content';
import { ComponentsModule } from '../../../common/components/components.module';
import { PipesModule } from '../../../common/pipes/pipes.module';
import { HtmlContentService } from '../../../providers/services/common-pages/html-content.service';

@NgModule({
  declarations: [
    WebContentPage,
  ],
  imports: [
    IonicPageModule.forChild(WebContentPage),
    ComponentsModule,
    PipesModule
  ],
  providers: [
    HtmlContentService
  ]
})
export class WebContentPageModule {}
