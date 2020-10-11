import { NgModule } from '@angular/core';
import { AutoResizeTextAreaDirective } from './auto-resize-text-area/auto-resize-text-area';
import { BlockCopyPasteDirective } from './block-copy-paste/block-copy-paste';

@NgModule({
	declarations: [
		AutoResizeTextAreaDirective,
    BlockCopyPasteDirective
	],
	imports: [],
	exports: [
		AutoResizeTextAreaDirective,
    BlockCopyPasteDirective
	]
})
export class DirectivesModule { }
