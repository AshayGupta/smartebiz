import { ComponentsModule } from './../../../common/components/components.module';
import { SetPasswordService } from './../../../providers/services/auth/setPassword.service';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmPasswordPage } from './confirm-password';
import { PipesModule } from '../../../common/pipes/pipes.module';

@NgModule({
  declarations: [
    ConfirmPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfirmPasswordPage),
    ComponentsModule,
    PipesModule
  ],
  providers: [
    SetPasswordService,
  ]
})
export class ConfirmPasswordPageModule {}
