import { NgModule } from '@angular/core';
import { SanitizerPipe } from './sanitizer/sanitizer';
import { FormatTimePipe } from './timer/formatTime';
import { MobileMaskingPipe } from './masking/mobile-masking';
import { EmailMaskingPipe } from './masking/email-masking';

@NgModule({
	declarations: [
		SanitizerPipe,
		FormatTimePipe,
		MobileMaskingPipe,
		EmailMaskingPipe
	],
	imports: [],
	exports: [
		SanitizerPipe,
		FormatTimePipe,
		MobileMaskingPipe,
		EmailMaskingPipe,
	]
})
export class PipesModule { }
