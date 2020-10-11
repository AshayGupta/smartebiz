import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

@Injectable()
export class ScreenOrientationService {

    constructor(private screenOrientation: ScreenOrientation) {
        console.log('ScreenOrientationService');
        // get current
        console.log('Screen Orientation type -> ', this.screenOrientation.type);
    }

    lockOrientation() {
        // set to landscape
        this.screenOrientation
            .lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE)
            .catch(error => {
                console.log('lockOrientation Error: ', error);
            });
    }

    // allow user rotate
    unlockOrientation() {
        this.screenOrientation.unlock();
    }

    // detect orientation changes
    onChangeOrientation(): Observable<any> {
        return this.screenOrientation.onChange();
    }

}
