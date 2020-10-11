import { ApiRouter, StatusCode } from "../../../common/enums/enums";
import { Injectable } from "@angular/core";
import { HttpService } from "../../httpService";

import { ApiUrl } from "../../../common/constants/constants";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { CountryCodeReqSerializer, CountryCodeResp } from "../../../dataModels/country-code.model";


// const endPoint = ApiRouter.ApiRouter2 + 'lfr/core/getCountryCodes'; 
const endPoint = ApiRouter.ApiRouter2 + 'mgo/cp/manageCpCollections?collection=cp_country&qry=';

@Injectable()
export class CountryCodeService extends HttpService<CountryCodeResp> {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new CountryCodeReqSerializer()
    );
  }


  // countryCodes(cbResp: (res) => void, cbErr?: (err: boolean) => void) {
  //   super.read().subscribe((resp) => {
  //     console.log('countryCodes response -> ', resp);
  //     cbResp(resp);  
  //   },
  //   error => {
  //     console.log('countryCodes error -> ',  error);
      // if (error.status == StatusCode.Status403) {
      //   cbErr(true);
      // }
  //   })
  // }

  countryCodes(cbResp: (res) => void, cbErr?: (err: boolean) => void) {
    super.queryString('').subscribe((resp) => {
      console.log('countryCodes response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200)) {
        cbResp(resp)
      }
    },
      (error) => {
        console.log('countryCodes error ->', error);
        if (error.status == StatusCode.Status403) {
          cbErr(true);
        }
      });
  }





}
