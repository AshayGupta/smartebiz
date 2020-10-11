import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerifyLoanPage } from './verify-loan';
import { ComponentsModule } from '../../../../common/components/components.module';

@NgModule({
  declarations: [
    VerifyLoanPage,
  ],
  imports: [
    IonicPageModule.forChild(VerifyLoanPage),
    ComponentsModule
  ],
})
export class VerifyLoanPageModule {}
