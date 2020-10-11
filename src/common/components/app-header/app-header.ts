import { LocalStorageKey } from './../../enums/enums';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ImgsPath } from '../../constants/constants';

@Component({
  selector: 'app-header',
  templateUrl: 'app-header.html'
})
export class AppHeaderComponent {

  @Input('headerTitle') headerTitle: string;
  @Input('headerImg') headerImg: string;
  @Input('headerInput3') headerInput3: string;
  @Input('subHeaderInput') subHeaderInput: string;
  @Output('headerOutput3') headerOutput3 = new EventEmitter();

  isLoggedIn: boolean;
  britamLogo: string = ImgsPath.britamLogo;

  constructor() {
    console.log('Hello AppHeaderComponent Component');
    this.isLoggedIn = JSON.parse(localStorage.getItem(LocalStorageKey.IsLoggedIn));
  }

  headerOutput(num: number) {
    switch (num) {
      case 3:
        this.headerOutput3.emit();
        break;

      default:
        break;
    }
  }

}
