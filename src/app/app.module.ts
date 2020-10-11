import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ErrorHandler, NgModule, Injector } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Base64 } from '@ionic-native/base64'
import { FileTransfer } from '@ionic-native/file-transfer';
import { FileChooser } from '@ionic-native/file-chooser';
import { IOSFilePicker } from '@ionic-native/file-picker';
import { File } from '@ionic-native/file';

import { MyApp } from './app.component';

// *** Common Pages *** //
import { WelcomePageModule } from '../pages/common-pages/welcome/welcome.module';

// *** Main Module *** //
import { MenuNavigationPageModule } from '../pages/main-module/dashboard-module/menu-navigation/menu-navigation.module';

// *** Providers *** //
import { AlertService } from './../providers/plugin-services/alert.service';
import { LoaderService } from '../providers/plugin-services/loader.service';
import { ActionsheetService } from '../providers/plugin-services/actionsheet.service';
import { LogonService } from './../providers/services/auth/logon.service';

import { HttpRequestResponseInterceptor } from '../providers/interceptors/http-request-response.interceptor';
import { MyProductsPageModule } from '../pages/main-module/product-module/my-products/my-products.module';
import { Device } from '@ionic-native/device';
import { Camera } from '@ionic-native/camera';
// import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';
import { CustomFirebaseAnalyticsProvider } from '../providers/custom-firebase-analytics/custom-firebase-analytics';


import { DatePipe } from '@angular/common';
import { DateFormat } from '../common/dateFormat/dateFormat';
import { GoogleAnalyticsService } from '../providers/plugin-services/google-analytics.service';
//import { GoogleAnalytics } from '@ionic-native/google-analytics';
 
@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true,
      backButtonText: '',
      backButtonIcon: 'md-arrow-round-back',
      scrollPadding: false,
      mode: 'ios'
    }),
    HttpModule,
    HttpClientModule,
    WelcomePageModule,
    MenuNavigationPageModule,
    MyProductsPageModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    FileTransfer,
    FileChooser,
    IOSFilePicker,
    File,
    InAppBrowser,
    Device,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestResponseInterceptor,
      multi: true
    },
    AlertService,
    LoaderService,
    ActionsheetService,
    LogonService,
    Camera,
    // FirebaseAnalytics,
    CustomFirebaseAnalyticsProvider,
    DatePipe,
    DateFormat,
  //  GoogleAnalytics,
    GoogleAnalyticsService,
    Base64
  ]
})
export class AppModule { 
  public static injector: Injector;

  constructor(injector: Injector, public ga: GoogleAnalyticsService) {
    AppModule.injector = injector;
  }
}
