import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LifeViewHistoryPage } from './life-view-history';
import { ComponentsModule } from '../../../../common/components/components.module';

@NgModule({
  declarations: [
    LifeViewHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(LifeViewHistoryPage),
    ComponentsModule
  ],
})
export class LifeViewHistoryPageModule {}
