import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../common/enums/enums';
import { HttpService } from '../../../httpService';
import { ApiUrl } from '../../../../common/constants/constants';
import { PremiumDueResp, PremiumDueSerializer, PremiumDueReq } from '../../../../dataModels/premium-due.model';

const endPoint = ApiRouter.ApiRouter3 + 'getAccountsPremiumDue';    

@Injectable()
export class GetPremiumDueService extends HttpService<PremiumDueResp>  {

  constructor(http: HttpClient) { 
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new PremiumDueSerializer()
    ); 
  }

  getPremiumDues(data: PremiumDueReq, cbResp: (res: PremiumDueResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: PremiumDueResp) => {
      console.log('getPremiumDues response -> ', resp);
      if (resp.statusCode == StatusCode.Status200) {
        cbResp(resp)
      }  
    },  
      error => {
        console.log('getPremiumDues error -> ', error);
        if (error.status == StatusCode.Status403) {
          cbErr(true);
        }
      });
  }

}
