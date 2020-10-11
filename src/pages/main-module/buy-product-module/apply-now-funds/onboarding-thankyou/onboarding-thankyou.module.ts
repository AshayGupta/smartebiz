import { ComponentsModule } from './../../../../../common/components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OnboardingThankyouPage } from './onboarding-thankyou';

@NgModule({
  declarations: [
    OnboardingThankyouPage,
  ],
  imports: [
    IonicPageModule.forChild(OnboardingThankyouPage),
    ComponentsModule
  ],
})
export class OnboardingThankyouPageModule {}
