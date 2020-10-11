import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../../common/enums/enums';
import { HttpService } from '../../../../httpService';
import { GeneralInsuranceResp, GeneralInsuranceSerializer, GeneralInsuranceReq } from '../../../../../dataModels/general-insurance.model';
import { ApiUrl } from '../../../../../common/constants/constants';

const endPoint = ApiRouter.ApiRouter2 + 'esb/erp/getAccountsList';

@Injectable()
export class GeneralInsuranceListService extends HttpService<GeneralInsuranceResp> {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new GeneralInsuranceSerializer()
    );
  }

  getGeneralInsuranceAccounts(data: GeneralInsuranceReq, cbResp: (res: GeneralInsuranceResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: GeneralInsuranceResp) => {
      console.log('getGeneralInsuranceAccounts response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200) && resp.accountsList.length > 0) {
        cbResp(resp)
      }
    },
      error => {
        console.log('getGeneralInsuranceAccounts error -> ', error);
        if (error.status == StatusCode.Status403) {
          cbErr(true);
        }
      });
  }

}
