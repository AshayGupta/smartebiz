import { ClientDetailsService } from './../../../../providers/services/main-module-services/product-services/client-details.service';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { ComponentsModule } from '../../../../common/components/components.module';
import { UpdatePasswordPageModule } from '../../../auth-pages/update-password/update-password.module';
import { CameraService } from '../../../../providers/plugin-services/camera.service';
import { UpdateProfilePicService } from '../../../../providers/services/common-pages/update-profile-pic.service';
import { GetProfilePicService } from '../../../../providers/services/common-pages/get-profile-pic.service';

@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),
    ComponentsModule,
    UpdatePasswordPageModule
  ],
  providers: [
    ClientDetailsService,
    CameraService,
    UpdateProfilePicService,
    GetProfilePicService
  ]
})
export class ProfilePageModule {}
