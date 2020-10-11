import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PensionDetailsPage } from './pension-details';
import { ComponentsModule } from '../../../../../common/components/components.module';
import { GetPensionAccountDetailsService } from '../../../../../providers/services/main-module-services/product-services/pension-services/pension-details/get-pension-account-details.service';
import { GetAccountBeneficiariesService } from '../../../../../providers/services/main-module-services/product-services/pension-services/get-account-beneficiary.service';
import { ScreenOrientationService } from '../../../../../providers/plugin-services/screen-orientation.service';

@NgModule({
  declarations: [
    PensionDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(PensionDetailsPage),
    ComponentsModule
  ],
  providers: [
    ScreenOrientationService,
    GetPensionAccountDetailsService,
    GetAccountBeneficiariesService,
  ]
})
export class PensionDetailsPageModule {}
