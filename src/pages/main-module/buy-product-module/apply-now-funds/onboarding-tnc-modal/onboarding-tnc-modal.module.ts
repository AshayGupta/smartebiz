import { PipesModule } from './../../../../../common/pipes/pipes.module';
import { ComponentsModule } from './../../../../../common/components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OnboardingTncModalPage } from './onboarding-tnc-modal';

@NgModule({
  declarations: [
    OnboardingTncModalPage,
  ],
  imports: [
    IonicPageModule.forChild(OnboardingTncModalPage),
    ComponentsModule,
    PipesModule
  ],
})
export class OnboardingTncModalPageModule {}
