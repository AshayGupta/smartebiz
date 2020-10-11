import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WelcomePage } from './welcome';
import { BranchLocatorPageModule } from '../need-help-module/branch-locator/branch-locator.module';
import { SyncVisitorsService } from '../../../providers/services/common-pages/sync-visitors.service';
import { ChatPageModule } from '../need-help-module/chat/chat.module';
import { FaqPageModule } from '../faq/faq.module';
import { ContactUsPageModule } from '../contact-us/contact-us.module';
import { AboutUsPageModule } from '../about-us/about-us.module';
import { BuyOnlinePageModule } from '../buy-online/buy-online.module';
import { LearnHowPageModule } from '../learn-how/learn-how.module';
import { KnowWhyPageModule } from '../know-why/know-why.module';
import { LoginPageModule } from '../../auth-pages/login/login.module';
import { WebContentPageModule } from '../web-content/web-content.module';

@NgModule({
  declarations: [
    WelcomePage,
  ],
  imports: [
    IonicPageModule.forChild(WelcomePage),
    BranchLocatorPageModule,
    ChatPageModule,
    FaqPageModule,
    ContactUsPageModule,
    AboutUsPageModule,
    BuyOnlinePageModule,
    LearnHowPageModule,
    KnowWhyPageModule,
    LoginPageModule,
    WebContentPageModule
  ],
  providers:[
    SyncVisitorsService,
   ]
})
export class WelcomePageModule {}
