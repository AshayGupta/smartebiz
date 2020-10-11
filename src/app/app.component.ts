import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { WelcomePage } from '../pages/common-pages/welcome/welcome';
import { MenuNavigationPage } from '../pages/main-module/dashboard-module/menu-navigation/menu-navigation';
import { LocalStorageKey } from '../common/enums/enums';
import { InvestmentAmountPage } from '../pages/main-module/buy-product-module/apply-now-funds/investment-amount/investment-amount';
import { PersonalDetailsPage } from '../pages/main-module/buy-product-module/apply-now-funds/personal-details/personal-details';
import { VerifyFundsPage } from '../pages/main-module/buy-product-module/apply-now-funds/verify-funds/verify-funds';
import { MarketFundsPage } from '../pages/main-module/buy-product-module/apply-now-funds/market-funds/market-funds';
import { KnowYourCustomerPage } from '../pages/main-module/buy-product-module/apply-now-funds/know-your-customer/know-your-customer';
import { VerifyPaymentModalPage } from '../pages/common-pages/payment/verify-payment-modal/verify-payment-modal';
import { BankDetailsPage } from '../pages/main-module/buy-product-module/apply-now-funds/bank-details/bank-details';
import { AddFundsPage } from '../pages/main-module/buy-product-module/topup-funds/add-funds/add-funds';
import { WithdrawPage } from '../pages/main-module/buy-product-module/withdraw-funds/withdraw/withdraw';
import { WithdrawPayoutPage } from '../pages/main-module/buy-product-module/withdraw-funds/withdraw-payout/withdraw-payout';
import { WithdrawVerifyPage } from '../pages/main-module/buy-product-module/withdraw-funds/withdraw-verify/withdraw-verify';
import { WithdrawThankyouPage } from '../pages/main-module/buy-product-module/withdraw-funds/withdraw-thankyou/withdraw-thankyou';
import { ThankYouTopupPage } from '../pages/main-module/buy-product-module/topup-funds/thank-you-topup/thank-you-topup';
import { OnboardingThankyouPage } from '../pages/main-module/buy-product-module/apply-now-funds/onboarding-thankyou/onboarding-thankyou';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any = WelcomePage//ThankYouTopupPage////////////////////////OnboardingThankyouPage//////////WithdrawThankyouPage//WithdrawVerifyPag//WithdrawPayoutPage//WithdrawPage // ;////WelcomePage//VerifyPaymentModalPage//InvestmentAmountPage//BankDetailsPage////KnowYourCustomerPage////AddFundsPage//WelcomePage////WelcomePage//;//;//WelcomePage //KnowYourCustomerPage////MarketFundsPage //KnowYourCustomerPage //  MarketFundsPage//PersonalDetailsPage//VerifyFundsPage//PersonalDetailsPage //InvestmentAmountPage //WelcomePage;  //PayNowScreenPage;  

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.goToDashboard()
    });
  }

  goToDashboard() {
    if (localStorage.getItem(LocalStorageKey.IsLoggedIn)) {
      this.rootPage = MenuNavigationPage;
    }
  }
}

