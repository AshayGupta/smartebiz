import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../../../common/enums/enums';
import { ApiUrl } from '../../../../../../common/constants/constants';
import { HttpService } from '../../../../../httpService';
import { LifePolicyBenefitsResp, LifePolicyBenefitsSerializer, LifePolicyBenefitsReq } from '../../../../../../dataModels/life-policy-benefits.model';


const endPoint = ApiRouter.ApiRouter2 + 'esb/life/getAccountBenefits';

@Injectable()
export class LifePolicyBenefitsService extends HttpService<LifePolicyBenefitsResp> {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new LifePolicyBenefitsSerializer()
    );
  }

  getPolicyBenefits(data: LifePolicyBenefitsReq, cbResp: (res: LifePolicyBenefitsResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: LifePolicyBenefitsResp) => {
      console.log('getPolicyBenefits response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200) && resp.policyBenefits.length > 0) {
        cbResp(resp)
      }
    },
      error => {
        console.log('getPolicyBenefits error -> ', error);
        if (error.status == StatusCode.Status403) {
          cbErr(true);
        }
      });
  }

}
