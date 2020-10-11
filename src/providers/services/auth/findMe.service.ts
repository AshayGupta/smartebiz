import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApiRouter, StatusCode } from './../../../common/enums/enums';
import { FindMeResp, FindMeSerializer, FindMeReq } from './../../../dataModels/findMe.model';
import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../common/constants/constants';
import { HttpService } from '../../httpService';

const endPoint = ApiRouter.ApiRouter2 + 'lfr/cust/signup';

@Injectable()
export class FindMeService extends HttpService<FindMeResp> {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new FindMeSerializer()
    );
  }

  custSignup(data: FindMeReq, cbResp: (res: FindMeResp) => void, cbErr?: (err: HttpErrorResponse) => void) {
    super.create(data).subscribe((resp: FindMeResp) => {
      console.log('custSignup response -> ', resp);
      if (resp.statusCode == StatusCode.Status200) {
        cbResp(resp)
      }
    },
      error => {
        console.log('custSignup error -> ', error);
        cbErr(error)
      });
  }

}
