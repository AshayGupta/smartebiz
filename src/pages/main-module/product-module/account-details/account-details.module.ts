import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountDetailsPage } from './account-details';
import { ComponentsModule } from '../../../../common/components/components.module';
import { ScreenOrientationService } from '../../../../providers/plugin-services/screen-orientation.service';

@NgModule({
  declarations: [
    AccountDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountDetailsPage),
    ComponentsModule
  ],
  providers: [
    ScreenOrientationService,
  ],
  exports: [
    AccountDetailsPage
  ]
})
export class AccountDetailsPageModule {}
