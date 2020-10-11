import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../../common/enums/enums';
import { HttpService } from '../../../../httpService';
import { LifeInsuranceResp, LifeInsuranceSerializer, LifeInsuranceReq } from '../../../../../dataModels/life-insurance.model';
import { ApiUrl } from '../../../../../common/constants/constants';

const endPoint = ApiRouter.ApiRouter2 + 'esb/life/getAccountsList';

@Injectable()
export class LifeInsuranceListService extends HttpService<LifeInsuranceResp> {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new LifeInsuranceSerializer()
    );
  }

  getLifeInsuranceAccounts(data: LifeInsuranceReq, cbResp: (res: LifeInsuranceResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: LifeInsuranceResp) => {
      console.log('getLifeInsuranceAccounts response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200) && resp.accountsList.length > 0) {
        cbResp(resp)
      }
    },
      error => {
        console.log('getLifeInsuranceAccounts error -> ', error);
        if (error.status == StatusCode.Status403) {
          cbErr(true);
        }
      });
  }

}
