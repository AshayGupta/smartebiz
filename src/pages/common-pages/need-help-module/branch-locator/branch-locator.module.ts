import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BranchLocatorPage } from './branch-locator';
import { ComponentsModule } from '../../../../common/components/components.module';
import { BranchLocatorService } from '../../../../providers/services/common-pages/branch-locator.service';

@NgModule({
  declarations: [
    BranchLocatorPage,
  ],
  imports: [
    IonicPageModule.forChild(BranchLocatorPage),
    ComponentsModule
  ],
  exports: [
    BranchLocatorPage
  ],
  providers: [
    BranchLocatorService
  ]
})
export class BranchLocatorPageModule {}
