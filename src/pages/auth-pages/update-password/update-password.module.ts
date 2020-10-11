import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpdatePasswordPage } from './update-password';
import { ComponentsModule } from '../../../common/components/components.module';
import { UpdatePasswordService } from '../../../providers/services/auth/update-password.service';

@NgModule({
  declarations: [
    UpdatePasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(UpdatePasswordPage),
    ComponentsModule
  ],
  providers: [
    UpdatePasswordService
  ]
})
export class UpdatePasswordPageModule {}
