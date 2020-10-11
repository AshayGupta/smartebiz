import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LogonService } from './../../../../providers/services/auth/logon.service';
import { BranchLocatorService } from './../../../../providers/services/common-pages/branch-locator.service';
import { LocateBranchResp, LocateBranch } from './../../../../dataModels/locate-branch.model';
import { LocalStorageKey } from '../../../../common/enums/enums';
import {
    GoogleMaps,
    GoogleMap,
    Marker,
    GoogleMapsEvent,
    LatLng,
    MarkerOptions, HtmlInfoWindow, LatLngBounds
} from '@ionic-native/google-maps'; 
import { PageTrack } from '../../../../common/decorators/page-track';

import { CustomFirebaseAnalyticsProvider } from '../../../../providers/custom-firebase-analytics/custom-firebase-analytics';

@IonicPage()
@Component({
    selector: 'page-branch-locator',
    templateUrl: 'branch-locator.html',
})
export class BranchLocatorPage {

    @ViewChild('map') mapElement: ElementRef;
    map: GoogleMap;

    headerTitle: string;
    locateBranchData: LocateBranch[] = [];
    countryArray = [];
    cityArray = [];
    coordinateArray = [];
    selectCountry: string;
    selectCity: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public logonService: LogonService,
        private branchLocatorService: BranchLocatorService,
        private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider
    ) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad BranchLocatorPage');
        this.setupPage();
        this.getBranchData();
        this.initMap();

        // Firebase Analytics 'screen_view' event tracking
        this.customFirebaseAnalytics.trackView('BranchLocator');
        
    }

    setupPage() {
        let isLoggedIn = JSON.parse(localStorage.getItem(LocalStorageKey.IsLoggedIn));
        this.headerTitle = isLoggedIn ? 'Branch Locator' : 'Branch Locator';
    }

    getBranchData() {
        this.branchLocatorService.locateBranch('', (resp: LocateBranchResp) => {
            this.locateBranchData = resp.locateBranch;
            this.getCountry();
        },
            (err: boolean) => {
                this.logonService.getToken((isTokenValid: boolean) => {
                    if (isTokenValid) {
                        this.getBranchData();
                    }
                })
            });
    }

    getCountry() {
        let country = [];

        this.locateBranchData.filter(function (element) {
            if (country.indexOf(element.countryName) === -1) {
                country.push(element.countryName);
            }
        });

        this.countryArray = country;
    }

    onCountrySelect(selectedCountry: string) {
        let city = [];
        this.selectCity = '';

        this.locateBranchData.filter(function (element) {
            if (element.countryName === selectedCountry && city.indexOf(element.city) === -1) {
                city.push(element.city);
            }
        });

        this.cityArray = city;
        console.log('City Array -> ', this.cityArray);
    }

    onCitySelect(country, city) {
        let coordinates = [];

        this.locateBranchData.filter(function (element) {
            if (element.countryName === country && element.city === city) {
                coordinates.push(element);
            }
        });

        this.coordinateArray = this.uniqueArray(coordinates, ['latitude', 'longitude'])
        console.log('Duplicate coordinates -> ', coordinates);
        console.log('Unique coordinates -> ', JSON.stringify(this.coordinateArray));

        this.populateMarkers();
    }

    uniqueArray(arr, keyProps) {
        const kvArray = arr.map(entry => {
            const key = keyProps.map(k => entry[k]).join('|');
            return [key, entry];
        });
        const map = new Map(kvArray);
        return Array.from(map.values());
    }

    initMap() {
        // let mapOptions: GoogleMapOptions = {
        // camera: {
        // zoom: 10,
        // tilt: 15
        // }
        // };

        this.map = GoogleMaps.create(this.mapElement.nativeElement);
        // this.setCameraAttributes();
    }

    populateMarkers() {
        this.map.clear();
        let bounds = [];

        this.coordinateArray.forEach((item) => {
            this.addMarker(item);
            let latlng = new LatLng(item.latitude, item.longitude);
            bounds.push(latlng);
        })

        let latlngBound: LatLngBounds = new LatLngBounds(bounds);
        let position = {
            target: latlngBound,
            duration: 1000
        };

        this.map.moveCamera(position);
        this.setCameraAttributes();
    }

    addMarker(item) {
        let coordinates: LatLng = new LatLng(item.latitude, item.longitude);
        let markerOptions: MarkerOptions = {
            position: coordinates,
            icon: 'blue',
            animation: 'DROP'
        };

        let marker: Marker = this.map.addMarkerSync(markerOptions);
        marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe((data) => {
            console.log('---', data);
            // marker.showInfoWindow(); 
            var htmlInfoWindow = new HtmlInfoWindow();
            htmlInfoWindow.setContent('<div class="p-mar-0" style="width:300px;text-align:left;"><p><b>' + item.name + '</b></p><p>' + item.addressLine1 + '</p><p>' + item.state + '</p><p>Ph:&nbsp;' + item.mainPhone + '</p><p>' + item.altPhone + '</p><p>Email:&nbsp;' + item.email + '</p></div>');
            htmlInfoWindow.open(marker);
        });
    }


    setCameraAttributes() {
        this.map.setCameraZoom(8);
    }


}