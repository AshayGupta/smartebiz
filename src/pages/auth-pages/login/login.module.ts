import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import { LoginService } from '../../../providers/services/auth/login.service';
import { SignupPageModule } from '../signup/signup.module';
import { OtpPageModule } from '../otp/otp.module';
import { ConfirmPasswordPageModule } from '../confirm-password/confirm-password.module';
import { ThankYouSignupPageModule } from '../thank-you-signup/thank-you-signup.module';
import { ComponentsModule } from '../../../common/components/components.module';

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
    ComponentsModule,
    SignupPageModule,
    OtpPageModule,
    ConfirmPasswordPageModule,
    ThankYouSignupPageModule
  ],
  providers: [
    LoginService
  ]
})
export class LoginPageModule {}
