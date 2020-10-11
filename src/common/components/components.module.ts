import { NgModule } from '@angular/core';
import { PageSegmentsComponent } from './page-segments/page-segments';
import { IonicModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';
import { AppHeaderComponent } from './app-header/app-header';
import { EditBeneficiaryComponent } from './edit-beneficiary/edit-beneficiary';

@NgModule({
	declarations: [
		PageSegmentsComponent,
		AppHeaderComponent,
		EditBeneficiaryComponent
	],
	imports: [
		IonicModule,
		CommonModule,
	],
	exports: [
		PageSegmentsComponent,
		AppHeaderComponent,
		EditBeneficiaryComponent
	]
})
export class ComponentsModule { }
