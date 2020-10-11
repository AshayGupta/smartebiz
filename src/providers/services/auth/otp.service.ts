import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../common/constants/constants';
import { HttpService } from '../../httpService';
import { ApiRouter, StatusCode } from '../../../common/enums/enums';
import { OtpSerializer, OtpResp, OtpReq } from '../../../dataModels/otp.model';

const endPoint = ApiRouter.ApiRouter2 + 'lfr/cust/sendOtp';

@Injectable()
export class OtpService extends HttpService<OtpResp> {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new OtpSerializer()
    );
  }

  generateOTP(data: OtpReq, cbResp: (res: OtpResp) => void, cbErr?: (err: HttpErrorResponse) => void) {
    super.create(data).subscribe((resp: OtpResp) => {
      console.log('generateOTP response ->', resp);
      if (resp.statusCode == StatusCode.Status200) {
        cbResp(resp);
      }
    },
      (error: HttpErrorResponse) => {
        console.log('generateOTP error ->', error);
        // if (error.status == StatusCode.Status403) {
        //   cbErr(true);
        // }
        cbErr(error);
      });
  }

}

