import { ComponentsModule } from './../../../common/components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactUsPage } from './contact-us';
import { ContactUsService } from '../../../providers/services/common-pages/contact-us.service';
import { CountryCodeService } from '../../../providers/services/common-pages/country-code.service';


@NgModule({
  declarations: [
    ContactUsPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactUsPage),
    ComponentsModule
  ],
  providers: [
    ContactUsService,
    CountryCodeService 
  ]
})
export class ContactUsPageModule {}
