import { HttpClient } from '@angular/common/http';
import { ApiRouter, StatusCode } from './../../../common/enums/enums';
import { SignupResp, SignupSerializer, SignupReq } from './../../../dataModels/signup.model';
import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../common/constants/constants';
import { HttpService } from '../../httpService';

const endPoint = ApiRouter.ApiRouter1 + 'sb/findACustomer';

@Injectable()
export class SignupService extends HttpService<SignupResp> {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new SignupSerializer()
    );
  }

  findCustomer(data: SignupReq, cbResp: (res: SignupResp) => void, cbErr?: (err: any) => void) {
    super.create(data).subscribe((resp: SignupResp) => {
      console.log('findCustomer response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200) && resp.userDetails) {
        cbResp(resp)
      }
    },
      error => {
        console.log('findCustomer error -> ', error);
        cbErr(error)
      });
  }

}
