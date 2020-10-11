import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../../../common/enums/enums';
import { ApiUrl } from '../../../../../../common/constants/constants';
import { HttpService } from '../../../../../httpService';
import { LifeAccountBonusesResp, LifeAccountBonusesSerializer, LifeAccountBonusesReq } from '../../../../../../dataModels/life-account-bonuses.model';

const endPoint = ApiRouter.ApiRouter2 + 'esb/life/getAccountBonuses';

@Injectable()
export class LifeAccountBonusesService extends HttpService<LifeAccountBonusesResp> {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new LifeAccountBonusesSerializer()
    );
  }

  getBonusPayments(data: LifeAccountBonusesReq, cbResp: (res: LifeAccountBonusesResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: LifeAccountBonusesResp) => {
      console.log('getBonusPayments response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200) && resp.accountBonuses.length > 0) {
        cbResp(resp)
      }
    },
      error => {
        console.log('getBonusPayments error -> ', error);
        if (error.status == StatusCode.Status403) {
          cbErr(true);
        }
      });
  }

}
