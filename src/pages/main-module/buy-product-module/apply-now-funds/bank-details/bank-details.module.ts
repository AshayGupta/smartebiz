import { ManageCollectionDocTypeService } from './../../../../../providers/services/main-module-services/bank-module-services/get-bank-doc-type.service';
import { ComponentsModule } from './../../../../../common/components/components.module';
import { InvestmentAmountPageModule } from './../investment-amount/investment-amount.module';
import { BankDetailsPage } from './bank-details';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BankListService } from '../../../../../providers/services/main-module-services/bank-module-services/get-bank-list.service';
import { BankBranchListService } from '../../../../../providers/services/main-module-services/bank-module-services/get-bank-branch-list.service';
import { GetTransactionNumberService } from '../../../../../providers/services/main-module-services/buy-product-module-services/get-transaction-number.service';
import { UploadDocumentService } from '../../../../../providers/services/main-module-services/upload-doc.service';
import { AmcMongoStagesService } from '../../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';
import { FileTransferService } from '../../../../../providers/plugin-services/file-transfer.service';
import { ChooseFileService } from '../../../../../providers/plugin-services/choose-file.service';

@NgModule({
  declarations:[
    BankDetailsPage
    ],
  imports:[
    IonicPageModule.forChild(BankDetailsPage),
    InvestmentAmountPageModule,
    ComponentsModule
  ],
  providers:[
    BankListService,
    BankBranchListService,
    ManageCollectionDocTypeService,
    GetTransactionNumberService,
    UploadDocumentService,
    AmcMongoStagesService,
    FileTransferService,
    ChooseFileService
  ]
})
export class BankDetailsPageModule{}
