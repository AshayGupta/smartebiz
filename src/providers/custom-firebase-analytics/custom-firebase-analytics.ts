import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
// import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';
 
@Injectable() 
export class CustomFirebaseAnalyticsProvider {

  constructor(public http: HttpClient, private platform: Platform,
    // private firebaseAnalytics: FirebaseAnalytics
    ) {
    console.log('Hello CustomFirebaseAnalyticsProvider Provider');
  }

   // Tracks an 'screen_view' event in Firebase Analytics 
   trackView(screenName: string) {
    this.platform.ready().then(() => {
        // this.firebaseAnalytics.setCurrentScreen(screenName);
    });
} 

// Tracks a custom event in Firebase Analytics
trackEvent(eventName: string, eventParams: any) {
    this.platform.ready().then(() => {
        // this.firebaseAnalytics.logEvent(eventName, eventParams);
    });
}

}
