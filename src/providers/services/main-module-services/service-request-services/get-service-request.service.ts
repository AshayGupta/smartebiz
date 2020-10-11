import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../common/enums/enums';
import { HttpService } from '../../../httpService';
import { ApiUrl } from '../../../../common/constants/constants';
import { ServiceHistoryReq, ServiceHistoryResp, ServiceHistorySerializer } from '../../../../dataModels/service-request.model';


const endPoint = ApiRouter.ApiRouter2 + '/mgo/cp/manageCpCollections?collection=cp_sr&qry=';
// const endPoint = ApiRouter.ApiRouter2 + 'esb/sr/getservicereq';


@Injectable()
export class ServiceHistoryListService extends HttpService<ServiceHistoryResp>  {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new ServiceHistorySerializer()
    );
  }


  getServiceHistoryList(data: ServiceHistoryReq, cbResp: (res: ServiceHistoryResp) => void, cbErr?: (err: boolean) => void) {

    const reqData = {
    "request.userDetails.idType": data.nationalIdType,
    "request.userDetails.idValue": data.nationalId,
    }

    super.queryString(JSON.stringify(reqData)).subscribe((resp: ServiceHistoryResp) => {
      console.log('getServiceHistoryList response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200) && resp.serviceHistoryList.length > 0) {
        cbResp(resp)
      }
    },
      error => {
        console.log('getServiceHistoryList error -> ', error);
        if (error.status == StatusCode.Status403) {
          cbErr(true);
        }
      });

  }

}
