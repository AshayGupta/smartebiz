import { CreateSwitchOrderService } from './../../../providers/services/main-module-services/buy-product-module-services/create-switch-order.service';
import { SwitchThankyouPage } from './../../main-module/buy-product-module/switch-funds/switch-thankyou/switch-thankyou';
import { SrRequest } from './../../../dataModels/amc-mongo-stages.model';
import { AmcMongoStagesService } from './../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';
import { FileAttachmentReq } from './../../../dataModels/file-attachment.model';
import { RaiseServiceRequestResp, RaiseServiceRequestReq } from './../../../dataModels/raise-service-request.model';
import { GetPdfFileAsBase64Service } from './../../../providers/services/main-module-services/buy-product-module-services/get-pdf-file-as-base64.service';
import { CreateSrPdfService } from './../../../providers/services/main-module-services/buy-product-module-services/create-sr-pdf.service';
import { CategoryMatrixService } from './../../../providers/services/main-module-services/service-request-services/get-category-matrix.service';
import { RaiseRequestService } from './../../../providers/services/main-module-services/service-request-services/raise-service-request.service';
import { CreateTransactionService } from './../../../providers/services/main-module-services/buy-product-module-services/create-transaction.service';
import { WithdrawThankyouPage } from './../../main-module/buy-product-module/withdraw-funds/withdraw-thankyou/withdraw-thankyou';
import { PensionThankYouPage } from '../../main-module/product-module/pension/beneficiary/pension-thank-you/pension-thank-you';
import { StatusCode, UserStatus, MongoAMCStaging, ClientDetailsStorageKey } from './../../../common/enums/enums';
import { VerifyOtpService } from './../../../providers/services/auth/verify-otp.service';
import { VerifyOtpReq, VerifyOtpResp } from './../../../dataModels/verify-otp.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfirmPasswordPage } from '../confirm-password/confirm-password';
import { OtpReq, OtpResp } from '../../../dataModels/otp.model';
import { SignupReq } from '../../../dataModels/signup.model';
import { OtpService } from '../../../providers/services/auth/otp.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LogonService } from '../../../providers/services/auth/logon.service';
import { AdvanceQuoteReq, AdvanceQuoteResp } from './../../../dataModels/advance-quote.model';
import { AdvanceQuoteService } from '../../../providers/services/main-module-services/loan-module-services/advance-quote.service';
import { ProcessPartialWithdrawalReq, ProcessPartialWithdrawalResp } from './../../../dataModels/process-partial-withdraw.model';
import { ProcessPartialWithdrawalService } from '../../../providers/services/main-module-services/partial-withdraw-module-services/process-partial-withdrawal.service';
import { Utils } from './../../../common/utils/utils';
import { PageName, LocalStorageKey } from '../../../common/enums/enums';
import { AlertService } from '../../../providers/plugin-services/alert.service';
import { WebContentPage } from '../../common-pages/web-content/web-content';
import { ThankYouPage } from '../../common-pages/thank-you/thank-you';
import { Environment } from '../../../common/constants/constants';
import { HttpErrorResponse } from '@angular/common/http';
import { FindMeReq, FindMeResp } from '../../../dataModels/findMe.model';
import { FindMeService } from '../../../providers/services/auth/findMe.service';
import { PageTrack } from '../../../common/decorators/page-track';
import { OtpVerification, AmcMongoStagesReq } from '../../../dataModels/amc-mongo-stages.model';
import { BuyProductReq } from '../../../dataModels/buy-product-model';
import { FinalDocProcessService } from '../../../providers/services/main-module-services/buy-product-module-services/final-doc-process.service';
import { CreateTransactionResp } from '../../../dataModels/create-transaction.model';
import { CreateSrPdfResp, CreateSrPdfReq } from '../../../dataModels/create-sr-pdf.model';
import { GetPdfFileAsBase64Resp } from '../../../dataModels/get-pdf-file-as-base64.model';
import { CategoryMatrixResp, CategoryMatrix } from '../../../dataModels/category-matrix.model';
import { FinalDocProcessReq } from '../../../dataModels/final-doc-process.model';
import { PersonalDetailsPage } from '../../main-module/buy-product-module/apply-now-funds/personal-details/personal-details';
import { CreateSwitchOrderResp } from '../../../dataModels/create-switch-order.model';
import { ManageCollectionPensionResp } from '../../../dataModels/manageCollection-pension.model';
import { AddBeneficiaryResp, AddBeneficiaryReq } from '../../../dataModels/add-beneficiary.mode';
import { AddBeneficiaryService } from '../../../providers/services/main-module-services/product-services/pension-services/add-beneficiary.service';
import { InitialWithdrawThankyouPage } from '../../main-module/product-module/pension/initial-withdraw-module/initial-withdraw-thankyou/initial-withdraw-thankyou';


export class OtpScreenData {
  navigateFromPage: PageName;
  title: string;
  subTitle: string;
  mobile: string;
  email: string;
  stepCount?: string;
  stepUrl?: string;
}

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html',
})
export class OtpPage {

  otpForm: FormGroup;
  submitAttempt: boolean = false;
  signupData: SignupReq = new SignupReq();
  verifyOtpReq = new VerifyOtpReq();
  otpData: OtpScreenData = new OtpScreenData();
  resendOtpTxt: any;
  otpResendTime: number = 180;
  headerTitle: string;
  subTitle: string;
  isSignupFlow: boolean;
  mobile: string;
  email: string;
  tncTxt: string = 'Terms and Conditions';
  otpTxt: string;
  stepCount: string;
  stepUrl: string;
  isProdEnv: boolean = Environment.prod;

  amcMongoReq: AmcMongoStagesReq;
  transactionId: string;
  otpVerification: OtpVerification[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public otpService: OtpService,
    public alertService: AlertService,
    public verifyOtpService: VerifyOtpService,
    public logonService: LogonService,
    public advanceQuoteService: AdvanceQuoteService,
    public processPartialWithdrawalService: ProcessPartialWithdrawalService,
    public findMeService: FindMeService,
    public createTransactionService: CreateTransactionService,
    public raiseServiceReqService: RaiseRequestService,
    public categoryMatrixService: CategoryMatrixService,
    public createSrPdfService: CreateSrPdfService,
    public getPdfFileAsBase64Service: GetPdfFileAsBase64Service,
    public finalDocProcessService: FinalDocProcessService,
    public amcMongoStagesService: AmcMongoStagesService,
    public createSwitchOrderService: CreateSwitchOrderService,
    public addBeneficiaryService: AddBeneficiaryService,
  ) {
    this.signupData = this.navParams.get('signupData');
    this.otpData = this.navParams.get('otpData');
    this.validateForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OtpPage');
    this.setupPage();
    if (this.otpData.stepCount && this.otpData.stepUrl) {
      this.stepUrl = this.otpData.stepUrl;
      this.stepCount = this.otpData.stepCount;
    } else {
      this.stepUrl = "assets/imgs/Step%20One.png";
      this.stepCount = "1";
    }
  }

  validateForm() {
    this.otpForm = this.formBuilder.group({
      otp: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(6)])],
    });
  }

  setupPage() {
    this.headerTitle = this.otpData.title;

    if (this.otpData.navigateFromPage == PageName.KnowYourCustomerPage) {
      this.mobile = this.otpData.mobile;
      this.email = this.otpData.email;
    }
    else {
      this.mobile = localStorage.getItem(ClientDetailsStorageKey.PhoneNumber);
      this.email = localStorage.getItem(ClientDetailsStorageKey.Email);
    }

    if (this.otpData.navigateFromPage == PageName.Signup) {
      this.isSignupFlow = true;
    }
    else {
      this.isSignupFlow = false;
      this.subTitle = this.otpData.subTitle;
    }

    this.resendOtp();
  }

  resendOtp() {
    this.callOTPService();
    this.startOtpTimer(this.otpResendTime)
  }

  callOTPService() {
    let otpReq = new OtpReq();
    otpReq.idOptionKey = this.signupData.idOptionKey;
    otpReq.idValue = this.signupData.idValue;
    otpReq.mobile = this.mobile

    this.otpService.generateOTP(otpReq, (resp: OtpResp) => {
      this.otpTxt = resp.otp

      //AmcMongoStaging
      let otp = new OtpVerification();
      otp.otp = this.otpTxt;
      otp.Otp = this.otpTxt;
      otp.dateTime = new Date().toUTCString();
      otp.Timestamp = new Date().toUTCString();
      otp.mobileNumber = this.mobile;
      this.otpVerification.push(otp);
      //AmcMongoStaging
    },
      (err) => {
        if (err.status == StatusCode.Status403) {
          this.logonService.getToken((isTokenValid: boolean) => {
            if (isTokenValid) {
              this.callOTPService();
            }
          })
        }
        else {
          this.alertService.Alert.alert(err.error.message, '', 'OK');
        }
      });
  }

  goToConfirmPasswordPage() {
    this.navCtrl.push(ConfirmPasswordPage, { 'signupData': this.signupData, 'headerTitle': this.otpData.title });
  }

  callFindMe() {
    let req = new FindMeReq();
    req.idOptionKey = this.signupData.idOptionKey;
    req.idValue = this.signupData.idValue;

    this.findMeService.custSignup(req, (resp: FindMeResp) => {
      this.goToConfirmPasswordPage();
    },
      error => {
        if (error.status == StatusCode.Status403) {
          this.logonService.getToken((isTokenValid: boolean) => {
            if (isTokenValid) {
              this.callFindMe();
            }
          })
        }
        else {
          this.alertService.Alert.alert(error.error.message, '', 'OK');
        }

      })
  }

  clickSubmit() {
    this.verifyOtpReq.idOptionKey = this.signupData.idOptionKey;
    this.verifyOtpReq.idValue = this.signupData.idValue;

    this.verifyOtpService.verifyOTP(this.verifyOtpReq, (resp: VerifyOtpResp) => {
      if (this.otpData.navigateFromPage == PageName.VerifyLoanPage) {
        this.confirmLoanAlert(); //LIFE Loan
      }
      else if (this.otpData.navigateFromPage == PageName.PartialWithdrawVerifyPage) {
        this.confirmWithdrawalAlert(); //LIFE Withdrawal
      }
      else if (this.otpData.navigateFromPage == PageName.KnowYourCustomerPage) {
        this.gotoPersonalDetailPage(); //BUY NOW PersonalDetail
      }
      else if (this.otpData.navigateFromPage == PageName.WithdrawVerifyPage) {
        this.confirmAmcWithdrawalAlert(); //AMC Withdrawal
      }
      else if (this.otpData.navigateFromPage == PageName.SwitchVerifyPage) {
        this.confirmAmcSwitchAlert(); //AMC Switch
      }
      else if (this.otpData.navigateFromPage == PageName.PensionWithdrawVerifyPage) {
        this.confirmPensionWithdrawAlert(); //PENSION Withdraw
      }
      else if (this.otpData.navigateFromPage == PageName.VerifyBeneficiaryPage) {
        this.confirmUpdateBeneficiaryAlert(); //PENSION UpdateBeneficiary
      }
      else {
        let status = localStorage.getItem(LocalStorageKey.UserStatus);
        if (status.toLowerCase() == UserStatus.New) {
          this.callFindMe();
        }
        else {
          this.goToConfirmPasswordPage()
        }
      }
    },
      (error: HttpErrorResponse) => {
        if (error.status == StatusCode.Status403) {
          this.logonService.getToken((isTokenValid: boolean) => {
            if (isTokenValid) {
              this.clickSubmit();
            }
          })
        }
        else {
          this.alertService.Alert.alert(error.error.message, '', 'OK');
        }
      });
  }

  // START ----- Apply Loan LIFE ------ START
  confirmLoanAlert() {
    let alertTitle = "Conﬁrm loan application";
    let alertMsg = "This will submit your loan application to us. By Clicking on ‘Apply Loan’ you are agreeing to our terms and conditions ";
    let cancelTxt = "CANCEL";
    let successTxt = "APPLY LOAN";

    this.alertService.AlertWith3Btn.confirm(alertMsg, alertTitle, cancelTxt, successTxt, 'confirmWithdraw', this.tncTxt).then(res => {
      if (res == 'tnc') {
        this.openTnC()
      }
      else {
        this.applyLoan();
      }
    },
      error => {

      });
  }

  applyLoan() {
    let advanceQuote: AdvanceQuoteReq = this.navParams.get('advanceQuote');

    this.advanceQuoteService.getAdvanceQuote(advanceQuote, (resp: AdvanceQuoteResp) => {
      this.navCtrl.push(ThankYouPage).then(() => {
        this.navCtrl.remove(1, this.navCtrl.getActive().index - 1);
      });
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.applyLoan();
          }
        })
      });
  }

  openTnC() {
    this.navCtrl.push(WebContentPage, { 'pageFlow': 'TnC', 'headerTitle': 'Terms and Conditions' })
  }
  // END ----- Apply Loan LIFE ------ END


  // START ----- Withdrawal LIFE ------ START
  confirmWithdrawalAlert() {
    let alertTitle = "Confirm partial withdraw";
    let alertMsg = "This will submit your application to us. By Clicking on ‘Withdraw’ you are agreeing to our terms and conditions";
    let cancelTxt = "CANCEL";
    let successTxt = "WITHDRAW";

    this.alertService.AlertWith3Btn.confirm(alertMsg, alertTitle, cancelTxt, successTxt, 'confirmWithdraw', this.tncTxt).then(res => {
      if (res == 'tnc') {
        this.openTnC()
      }
      else {
        this.withdrawalRequest();
      }
    },
      error => {

      });
  }

  withdrawalRequest() {
    let partialReq: ProcessPartialWithdrawalReq = this.navParams.get('processPartialWithdrawalData');
    partialReq.process = 'P';

    this.processPartialWithdrawalService.getProcessPartialWithdrawal(partialReq, (resp: ProcessPartialWithdrawalResp) => {
      this.navCtrl.push(ThankYouPage).then(() => {
        this.navCtrl.remove(1, this.navCtrl.getActive().index - 1);
      });
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.withdrawalRequest();
          }
        })
      });
  }
  // END ----- Withdrawal LIFE ------ END


  // START ----- BUY NOW ------ START
  gotoPersonalDetailPage() {
    let buyProductReq: BuyProductReq = this.navParams.get('buyProductReq');
    buyProductReq.otpVerification = this.otpVerification;

    this.navCtrl.push(PersonalDetailsPage, { 'buyProductReq': buyProductReq });
  }
  // END ----- BUY NOW ------ END


  // START ----- Withdrawal AMC ------ START
  confirmAmcWithdrawalAlert() {
    let alertTitle = "Confirm Partial Withdrawal";
    let alertMsg = "By clicking ‘Withdraw’ you are agreeing to our terms and conditions.";
    let cancelTxt = "CANCEL";
    let successTxt = "Withdraw";

    this.alertService.Alert.confirm(alertMsg, alertTitle, cancelTxt, successTxt).then(res => {
      this.amcWithdrawRequest();
    });
  }

  amcWithdrawRequest() {
    this.amcMongoReq = this.navParams.get('amcMongoReq');
    this.amcMongoReq.cp_amc_withdrawal.otp = this.otpVerification;
    this.amcMongoReq.cp_amc_withdrawal.stages.filter(item => {
      if (item.name == "OTP Verified") {
        item.status = MongoAMCStaging.Done;
      }
    });
    this.updateMongoStage(this.amcMongoReq);

    this.createTransaction().then((resp: CreateTransactionResp) => {
      this.transactionId = resp.transaction_id;
      this.amcMongoReq.cp_amc_withdrawal.partialRequestDetails.transactionId = this.transactionId;
    });

    this.categoryMatrix().then((resp: CategoryMatrixResp) => {
      this.createSrPdf(resp.categoryMatrix[0]);
    },
    error => {
      this.alertServerIssue();
    });
  }

  createTransaction() {
    return new Promise((resolve, reject) => {
      this.createTransactionService.createTransaction(this.navParams.get('createTransactionReq'), (resp: CreateTransactionResp) => {
        resolve(resp)
      }, (error: boolean) => {
        this.alertServerIssue();
      })
    });
  }

  createSrPdf(categoryMatrix: CategoryMatrix) {
    let createSrPdfReq: CreateSrPdfReq = this.navParams.get('createSrPdfReq')
    createSrPdfReq.category = categoryMatrix.category;
    createSrPdfReq.jsonArray.forEach(data => {
      data.otp = this.otpTxt;
      data.otpMobileNo = this.mobile;
    });
    console.log(JSON.stringify(createSrPdfReq));

    this.createSrPdfService.createSrPdf(createSrPdfReq, (resp: CreateSrPdfResp) => {
      this.getPdfBase64String().then((resp: GetPdfFileAsBase64Resp) => {
        this.serviceRequest(resp, categoryMatrix);
      },
      err => {
        this.alertServerIssue();
      });
    }, (error: boolean) => {
      this.alertServerIssue();
    })
  }

  serviceRequest(base64: GetPdfFileAsBase64Resp, categoryMatrix: CategoryMatrix) {
    let raiseServiceReq: RaiseServiceRequestReq = this.navParams.get('raiseServiceReq');
    raiseServiceReq.category = categoryMatrix;
    raiseServiceReq.subCategory = categoryMatrix.subCategory;
    raiseServiceReq.message += ",Transaction ID=" + this.transactionId;
    raiseServiceReq.commMethod = "Customer";
    raiseServiceReq.fileAttachment = [];

    this.raiseServiceReqService.addServiceRequest(raiseServiceReq, (resp: RaiseServiceRequestResp) => {
      this.finalDocProcess(resp).then((srNumber: string) => {
        this.navCtrl.push(WithdrawThankyouPage, { 'withdrawReq': this.navParams.get('withdrawReq'), 'srNumber': srNumber, 'transactionDate': new Date() }).then(() => {
          this.navCtrl.remove(1, this.navCtrl.getActive().index - 1);
        });
      },
      error => {
        this.alertServerIssue();
      });

      this.amcMongoReq.cp_amc_withdrawal.stages.filter(item => {
        if (item.name == "SR-CREATED") {
          item.status = MongoAMCStaging.Done;
        }
      });
      this.amcMongoReq.cp_amc_withdrawal.srRequest = new SrRequest();
      this.amcMongoReq.cp_amc_withdrawal.srRequest.srNumber = resp.srNumber;
      this.amcMongoReq.cp_amc_withdrawal.srRequest.srStatus = categoryMatrix.srstatus;
      this.amcMongoReq.cp_amc_withdrawal.srRequest.srDateTime = new Date().toUTCString();
      this.updateMongoStage(this.amcMongoReq);
    },
      (error: HttpErrorResponse) => {
        if (error.status == StatusCode.Status403) {
          this.logonService.getToken((isTokenValid: boolean) => {
            if (isTokenValid) {
              this.serviceRequest(base64, categoryMatrix);
            }
          })
        }
        else {
          this.alertServerIssue();
        }
      })
  }
  // END ----- Withdrawal AMC ------ END


  // START ----- Switch AMC ------ START
  confirmAmcSwitchAlert() {
    let alertTitle = "Confirm Switch";
    let alertMsg = "By clicking ‘Switch’ you are agreeing to our terms and conditions.";
    let cancelTxt = "CANCEL";
    let successTxt = "Switch";

    this.alertService.Alert.confirm(alertMsg, alertTitle, cancelTxt, successTxt).then(res => {
      this.amcSwitchRequest();
    },
      error => {
      });
  }

  amcSwitchRequest() {
    this.amcMongoReq = this.navParams.get('amcMongoReq');
    this.amcMongoReq.cp_amc_switch.otp = this.otpVerification;
    this.amcMongoReq.cp_amc_switch.stages.filter(item=>{
      if(item.name=="otpVerification"){
        item.status="done";
      }
    });
    this.updateMongoStage(this.amcMongoReq);

    this.createSwitchOrder();
  }

  createSwitchOrder() {
    this.createSwitchOrderService.createSwitchOrder(this.navParams.get('createSwitchOrderReq'), (resp: CreateSwitchOrderResp) => {
      this.switchCategoryMatrix();
    }, (error: boolean) => {
      this.logonService.getToken((isTokenValid: boolean) => {
        if (isTokenValid) {
          this.createSwitchOrder();
        }
      })
    })
  }

  switchCategoryMatrix() {
    this.categoryMatrixService.getCategoryMatrixData(this.navParams.get('categoryMatrixReq'), (resp: CategoryMatrixResp) => {
      this.serviceRequestSwitch(resp.categoryMatrix[0]);
    }, (error: boolean) => {
      this.logonService.getToken((isTokenValid: boolean) => {
        if (isTokenValid) {
          this.switchCategoryMatrix();
        }
      })
    })
  }

  serviceRequestSwitch(categoryMatrix: CategoryMatrix) {
    let raiseServiceReq: RaiseServiceRequestReq = this.navParams.get('raiseServiceReq');
    raiseServiceReq.category = categoryMatrix;
    raiseServiceReq.subCategory = categoryMatrix.subCategory;
    // raiseServiceReq.message += ",Transaction ID=" + this.transactionId;

    this.raiseServiceReqService.addServiceRequest(raiseServiceReq, (resp: RaiseServiceRequestResp) => {
      this.amcMongoReq.cp_amc_switch.stages.filter(item=>{
        if(item.name=="SR-CREATED"){
          item.status = "done";
        }
      });
      
      this.amcMongoReq.cp_amc_switch.srRequest = new SrRequest();
      this.amcMongoReq.cp_amc_switch.srRequest.srNumber = resp.srNumber;
      this.amcMongoReq.cp_amc_switch.srRequest.srStatus = categoryMatrix.srstatus;
      this.amcMongoReq.cp_amc_switch.srRequest.srDateTime = new Date().toUTCString();
      this.updateMongoStage(this.amcMongoReq);

      this.switchfinalDocProcess(resp);
    },
      (error: HttpErrorResponse) => {
        if (error.status == StatusCode.Status403) {
          this.logonService.getToken((isTokenValid: boolean) => {
            if (isTokenValid) {
              this.serviceRequestSwitch(categoryMatrix);
            }
          })
        }
      })
  }

  switchfinalDocProcess(srResp: RaiseServiceRequestResp) {
    let finalDocProcessReq: FinalDocProcessReq = this.navParams.get('finalDocProcessReq');
    finalDocProcessReq.srNumber = srResp.srNumber;

    this.finalDocProcessService.finalDocProcess(finalDocProcessReq, (resp: any) => {
      this.gotoSwitchThankYouPage(srResp.srNumber);

    }, (error: boolean) => {
      this.logonService.getToken((isTokenValid: boolean) => {
        if (isTokenValid) {
          this.switchfinalDocProcess(srResp);
        }
      })
    })
  }

  gotoSwitchThankYouPage(srNumber: string) {
    this.navCtrl.push(SwitchThankyouPage, { 'switchReq': this.navParams.get('switchReq'), 'srNumber': srNumber, 'transactionDate': new Date() }).then(() => {
      this.navCtrl.remove(1, this.navCtrl.getActive().index - 1);
    });
  }
  // END ----- Switch AMC ------ END


  // START ----- Withdrawal PENSION ------ START
  confirmPensionWithdrawAlert() {
    let alertTitle = "Confirm Partial Withdraw";
    let alertMsg = "This action will submit your application. By clicking ‘Withdraw’ you are agreeing to our terms and conditions.";
    let cancelTxt = "CANCEL";
    let successTxt = "Withdraw";

    this.alertService.Alert.confirm(alertMsg, alertTitle, cancelTxt, successTxt).then(res => {
      this.completePensionWithdrawRequest();
    },
      error => {
      });
  }

  async completePensionWithdrawRequest() {
    let pensionMongoReq: AmcMongoStagesReq = this.navParams.get('pensionMongoReq');
    pensionMongoReq.cp_pension_partial['otp'] = [];
    pensionMongoReq.cp_pension_partial['otp'] = this.otpVerification;
    pensionMongoReq.cp_pension_partial["stages"].filter(item => {
      if (item.name == "OTP Verified") {
        item.status = MongoAMCStaging.Done;
      }
    });

    this.updateMongoStage(pensionMongoReq);

    let createSrPdfReq: CreateSrPdfReq = this.navParams.get('createSrPdfReq');
    createSrPdfReq.jsonArray.filter(json => {
      json['otp'] = this.otpTxt;
      json['otpMobileNo'] = this.mobile;
    });
    
    try {
      let matrixResp = await this.categoryMatrix();
      matrixResp.categoryMatrix[0].owner="";
      let getPdfResp = await this.createPdf(matrixResp.categoryMatrix[0], createSrPdfReq);
      let getBase64Resp = await this.getPdfBase64String();
      let srResp = await this.raiseServiceRequest(getBase64Resp, matrixResp.categoryMatrix[0]);
      let srNumber = await this.finalDocProcess(srResp);

      pensionMongoReq.cp_pension_partial["stages"].filter(item => {
        if (item.name == "SR-CREATED") {
          item.status = MongoAMCStaging.Done;
        }
      });
      pensionMongoReq.cp_pension_partial["srNumber"] = srNumber;

      this.updateMongoStage(pensionMongoReq);
      this.gotoPensionWithdrawThankYouPage(pensionMongoReq);
    }
    catch (error) {
      this.alertServerIssue();
    }
  }

  gotoPensionWithdrawThankYouPage(pensionMongoReq: AmcMongoStagesReq) {
    this.navCtrl.push(InitialWithdrawThankyouPage, {
      'pensionMongoReq': pensionMongoReq
      // 'transactionDate': new Date()
    }).then(() => {
      this.navCtrl.remove(1, this.navCtrl.getActive().index - 1);
    });
  }
  // END ----- Withdrawal PENSION ------ END


  // START ----- Update Beneficiary PENSION ------ START
  confirmUpdateBeneficiaryAlert() {
    let alertTitle = "Confirm update beneficiary";
    let alertMsg = "This will submit your application to us. By Clicking on ‘Update Beneficiary’ you are agreeing to our terms and conditions";
    let cancelTxt = "CANCEL";
    let successTxt = "UPDATE BENEFICIARY";

    this.alertService.Alert.confirm(alertMsg, alertTitle, cancelTxt, successTxt).then(res => {
      // if (res == 'tnc') {
      //   this.openTnC()
      // }
      // else {
      //   this.updateBeneficiaryRequest();
      // }
      this.updateBeneficiaryRequest();
    },
      error => {
      });
  }

  async updateBeneficiaryRequest() {
    let cpReq: ManageCollectionPensionResp = this.navParams.get('cpPension');

    cpReq.request.OTPData = this.otpVerification;
    cpReq.request.stages.filter(item => {
      if (item.name == "OTP Verified") {
        item.status = MongoAMCStaging.Done;
      }
    });

    this.updateBeneficiaryMongo(cpReq);

    let createSrPdfReq: CreateSrPdfReq = this.navParams.get('createSrPdfReq');

    createSrPdfReq.clientDetailsJson['OTPData'] = {
      "mobileNumber": this.otpVerification[this.otpVerification.length - 1].mobileNumber,
      "otp": [this.otpVerification[this.otpVerification.length - 1].otp]
    }

    try {
      let matrixResp = await this.categoryMatrix()
      let getPdfResp = await this.createPdf(matrixResp.categoryMatrix[0], createSrPdfReq);
      let getBase64Resp = await this.getPdfBase64String();
      let srResp = await this.raiseServiceRequest(getBase64Resp, matrixResp.categoryMatrix[0]);
      let srNumber = await this.finalDocProcess(srResp);

      cpReq.request.stages.filter(item => {
        if (item.name == "SR Creation") {
          item.status = MongoAMCStaging.Done;
        }
      });
      cpReq.request.SR_Number = srNumber;

      this.updateBeneficiaryMongo(cpReq);
      this.gotoBeneficiaryThankYouPage(cpReq);
    }
    catch (error) {
      this.alertServerIssue();
    }
  }

  gotoBeneficiaryThankYouPage(cpPension: ManageCollectionPensionResp) {
    this.navCtrl.push(PensionThankYouPage, {
      'cpPension': cpPension
      // 'transactionDate': new Date()
    }).then(() => {
      this.navCtrl.remove(1, this.navCtrl.getActive().index - 1);
    });
  }

  updateBeneficiaryMongo(cpReq: ManageCollectionPensionResp) {
    cpReq.request.dateImported = new Date().toUTCString();
    this.addBeneficiaryService.addBeneficiary(cpReq.request, (resp: AddBeneficiaryResp) => {
    },
      (err) => {
        if (err.status == StatusCode.Status403) {
          this.logonService.getToken((isTokenValid: boolean) => {
            if (isTokenValid) {
              this.updateBeneficiaryMongo(cpReq);
            }
          })
        }
      });
  }
  // END ----- Update Beneficiary PENSION ------ END


  // ------------ COMMON FUNCTIONS ---------------
  alertServerIssue() {
    this.alertService.Alert.alert('There is some temporary server issue. Please try again in sometime.');
  }

  startOtpTimer(time: number) {
    Utils.startTimer(time).subscribe(sec => {
      this.resendOtpTxt = sec;
    });
  }

  // 1. categoryMatrix
  categoryMatrix(): Promise<CategoryMatrixResp> {
    return new Promise((resolve, reject) => {
      this.categoryMatrixService.getCategoryMatrixData(this.navParams.get('categoryMatrixReq'), (resp: CategoryMatrixResp) => {
        resolve(resp)
      }, (error: boolean) => {
        reject(error);
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.categoryMatrix();
          }
        })
      });
    });
  }

  // 2. createPdf
  createPdf(categoryMatrix: CategoryMatrix, createSrPdfReq: CreateSrPdfReq): Promise<CreateSrPdfResp> {
    return new Promise((resolve, reject) => {
      let req: CreateSrPdfReq = createSrPdfReq;
      req.category = categoryMatrix.category;

      this.createSrPdfService.createSrPdf(req, (resp: CreateSrPdfResp) => {
        if ((resp.status == (StatusCode.Status200).toString())) {
          resolve(resp);
        }
        else {
          reject(resp);
        }

      }, (error: boolean) => {
        reject(error);
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.createPdf(categoryMatrix, createSrPdfReq);
          }
        })
      })
    });
  }

  // 3. getPdfBase64String
  getPdfBase64String(): Promise<GetPdfFileAsBase64Resp> {
    return new Promise((resolve, reject) => {
      this.getPdfFileAsBase64Service.getPdfFileAsBase64(this.navParams.get('getPdfFileAsBase64Req'), (resp: GetPdfFileAsBase64Resp) => {
        resolve(resp)
      }, (error: boolean) => {
        reject(error);
        // this.logonService.getToken((isTokenValid: boolean) => {
        //   if (isTokenValid) {
        //     this.getPdfBase64String();
        //   }
        // })
      });
    });
  }

  // 4. getServiceRequest
  raiseServiceRequest(base64Resp: GetPdfFileAsBase64Resp, categoryMatrix: CategoryMatrix): Promise<RaiseServiceRequestResp> {
    return new Promise((resolve, reject) => {
      let fileReq = [];

      if(base64Resp.attachmentArray.length > 0) {
        base64Resp.attachmentArray.filter(item => {
          let file = {};
          file["base64File"] = item.base64String;
          file["fileName"] = item.fileName;
          file["fileExtension"] = item.fileName.substring(item.fileName.lastIndexOf('.') +1)
          fileReq.push(file);
        });
      }

      let raiseServiceReq: RaiseServiceRequestReq = this.navParams.get('raiseServiceReq');
      raiseServiceReq.category = categoryMatrix;
      raiseServiceReq.subCategory = categoryMatrix.subCategory;
      raiseServiceReq.attachment = {'attachment': fileReq };

      this.raiseServiceReqService.addServiceRequest(raiseServiceReq, (resp: RaiseServiceRequestResp) => {
        resolve(resp)
      },
        (error: HttpErrorResponse) => {
          if (error.status == StatusCode.Status403) {
            this.logonService.getToken((isTokenValid: boolean) => {
              if (isTokenValid) {
                this.raiseServiceRequest(base64Resp, categoryMatrix);
              }
            })
          }
          else {
            reject(error);
          }
        })
    });
  }

  // 5. finalDocProcess
  finalDocProcess(srResp: RaiseServiceRequestResp): Promise<string> {
    return new Promise((resolve, reject) => {
      let finalDocProcessReq: FinalDocProcessReq = this.navParams.get('finalDocProcessReq');
      finalDocProcessReq.srNumber = srResp.srNumber;
      // finalDocProcessReq.emailAddress = 'ashay.gupta@infoaxon.com';

      this.finalDocProcessService.finalDocProcess(finalDocProcessReq, (resp: any) => {
        resolve(srResp.srNumber)
      }, (error: boolean) => {
        reject(error);
        // this.logonService.getToken((isTokenValid: boolean) => {
        //   if (isTokenValid) {
        //     this.finalDocProcess(srResp);
        //   }
        // })
      })
    });
  }

  // Update mongo stages
  updateMongoStage(amcMongoReq: AmcMongoStagesReq) {
    this.amcMongoStagesService.updateAmcMongoStage(amcMongoReq, (resp: any) => {

    }, (error: boolean) => {
      this.logonService.getToken((isTokenValid) => {
        if (isTokenValid) {
          this.updateMongoStage(amcMongoReq);
        }
      })
    })
  }

}
