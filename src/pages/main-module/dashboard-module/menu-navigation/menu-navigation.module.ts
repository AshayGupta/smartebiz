import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MenuNavigationPage } from './menu-navigation';
import { PayNowScreenPageModule } from '../../pay-now-module/pay-now-screen/pay-now-screen.module';
import { ServiceRequestsListPageModule } from '../../service-request-module/service-requests-list/service-requests-list.module';
import { ProfilePageModule } from '../profile/profile.module';
import { GetProfilePicService } from '../../../../providers/services/common-pages/get-profile-pic.service';
import { DocumentmediaPageModule } from '../../../common-pages/documentmedia/documentmedia.module';

@NgModule({
  declarations: [
    MenuNavigationPage,
  ],
  imports: [
    IonicPageModule.forChild(MenuNavigationPage),
    PayNowScreenPageModule,
    ServiceRequestsListPageModule,
    ProfilePageModule,
    DocumentmediaPageModule
  ],
  providers: [
    GetProfilePicService
  ]
})
export class MenuNavigationPageModule {}
