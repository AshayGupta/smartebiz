import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../../../common/enums/enums';
import { ApiUrl } from '../../../../../../common/constants/constants';
import { HttpService } from '../../../../../httpService';
import { LifePremiumDetailsResp, LifePremiumDetailsSerializer, LifePremiumDetailsReq } from '../../../../../../dataModels/life-premium-details.model';


const endPoint = ApiRouter.ApiRouter2 + 'esb/life/getAccountPremiumPayments';

@Injectable()
export class LifePremiumDetailsService extends HttpService<LifePremiumDetailsResp> {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new LifePremiumDetailsSerializer()
    );
  }

  getPremiumDetails(data: LifePremiumDetailsReq, cbResp: (res: LifePremiumDetailsResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: LifePremiumDetailsResp) => {
      console.log('getPremiumDetails response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200) && resp.accountPremiumDetails.length > 0) {
        cbResp(resp)
      }
    },
      error => {
        console.log('getPremiumDetails error -> ', error);
        if (error.status == StatusCode.Status403) {
          cbErr(true);
        }
      });
  }

}
