import { Injectable } from '@angular/core';
//import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Events, Platform } from 'ionic-angular';

@Injectable()
export class GoogleAnalyticsService {

    constructor(
        private events: Events,
  //      public googleAnalytics: GoogleAnalytics,
        public platform: Platform,
    ) {
        console.log("GoogleAnalyticsService");
        this.trackView();
    }

    trackView() {
        // subscribe to the view:enter event
        // this.platform.ready().then(() => {
        //     this.events.subscribe('view:enter', (view: string) => {
                // do the actual tracking
        //         this.track(view);
        //     });
        // });
    }

    track(view) {
        // this.googleAnalytics.startTrackerWithId('UA-130030195-1').then(() => {
        //     console.log("GoogleAnalytics trackView ->", view);
        //     this.googleAnalytics.trackView(view);
        // })
        //     .catch(e => console.log('Error starting GoogleAnalytics', e));
    }

}