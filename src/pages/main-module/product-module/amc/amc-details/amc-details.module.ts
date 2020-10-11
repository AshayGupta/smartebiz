import { NgModule } from "@angular/core";
import { AmcDetailsPage } from "./amc-details";
import { IonicPageModule } from "ionic-angular";
import { AccountDetailsPageModule } from "../../account-details/account-details.module";
import { AmcAccountDetailsService } from "../../../../../providers/services/main-module-services/product-services/amc-services/amc-tabs/amc-account-details.service";
import { AmcNomineesListService } from "../../../../../providers/services/main-module-services/product-services/amc-services/amc-tabs/amc-nominees-list.service";
import { AmcAccountHoldingsService } from "../../../../../providers/services/main-module-services/product-services/amc-services/amc-tabs/amc-account-holdings.service";
import { AmcClientContactsService } from "../../../../../providers/services/main-module-services/product-services/amc-services/amc-tabs/amc-client-contacts.service";
import { AmcFundTransactionService } from "../../../../../providers/services/main-module-services/product-services/amc-services/amc-tabs/amc-fund-transaction.service";
import { AmcClientDetailsService } from "../../../../../providers/services/main-module-services/product-services/amc-services/amc-client-detail.service";

@NgModule({
  declarations: [
    AmcDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(AmcDetailsPage),
    AccountDetailsPageModule,
  ],
  providers: [
    AmcAccountDetailsService,
    AmcNomineesListService,
    AmcAccountHoldingsService,
    AmcClientContactsService,
    AmcFundTransactionService,
    AmcClientDetailsService
  ]
})
export class AmcDetailsPageModule {}
