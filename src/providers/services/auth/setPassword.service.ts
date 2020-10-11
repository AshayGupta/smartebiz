import { SetPasswordResp, SetPasswordReq, SetPasswordSerializer } from './../../../dataModels/setPassword.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../common/constants/constants';
import { HttpService } from '../../httpService';
import { ApiRouter, StatusCode } from '../../../common/enums/enums';

const endPoint = ApiRouter.ApiRouter2 + 'lfr/cust/password';

@Injectable()
export class SetPasswordService extends HttpService<SetPasswordResp> {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new SetPasswordSerializer()
    );
  }

  setPassword(data: SetPasswordReq, cbResp: (res: SetPasswordResp) => void, cbErr?: (err: HttpErrorResponse) => void) {
    super.create(data).subscribe((resp: SetPasswordResp) => {
      console.log('setPassword response ->', resp);
      if (resp.statusCode == StatusCode.Status200) {
        cbResp(resp);
      }
    },
      (error: HttpErrorResponse) => {
        console.log('setPassword error ->', JSON.stringify(error));
        cbErr(error);
      });
  }

}

