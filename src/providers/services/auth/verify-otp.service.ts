import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../common/constants/constants';
import { HttpService } from '../../httpService';
import { ApiRouter, StatusCode } from '../../../common/enums/enums';
import { VerifyOtpResp, VerifyOtpSerializer, VerifyOtpReq } from '../../../dataModels/verify-otp.model';

const endPoint = ApiRouter.ApiRouter2 + 'lfr/cust/verifyOtp';

@Injectable()
export class VerifyOtpService extends HttpService<VerifyOtpResp> {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new VerifyOtpSerializer()
    );
  }

  verifyOTP(data: VerifyOtpReq, cbResp: (res: VerifyOtpResp) => void, cbErr?: (err: any) => void) {
    super.create(data).subscribe((resp: VerifyOtpResp) => {
      console.log('verifyOTP response ->', resp);
      if (resp.statusCode == StatusCode.Status200) {
        cbResp(resp);
      }
    },
      (error: HttpErrorResponse) => {
        console.log('verifyOTP error ->', error);
        cbErr(error)
      });
  }

}

