import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../../common/enums/enums';
import { HttpService } from '../../../../httpService';
import { AssetManagementResp, AssetManagementSerializer, AssetManagementReq } from '../../../../../dataModels/asset-management.model';
import { ApiUrl } from '../../../../../common/constants/constants';



const endPoint = ApiRouter.ApiRouter2 + 'esb/amc/getAccountsList';

@Injectable()
export class AssetManagementListService extends HttpService<AssetManagementResp>  {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new AssetManagementSerializer()
    );
  }

  getAssetManagementAccounts(data: AssetManagementReq, cbResp: (res: AssetManagementResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: AssetManagementResp) => {
      console.log('getAssetManagementAccounts response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200) && resp.accountsList.length > 0) {
        cbResp(resp)
      }
    },
      error => {
        console.log('getAssetManagementAccounts error -> ', error);
        if (error.status == StatusCode.Status403) {
          cbErr(true);
        }
      });
  }

}
