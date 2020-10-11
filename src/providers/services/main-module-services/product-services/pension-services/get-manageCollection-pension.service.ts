import { ManageCollectionPensionResp, ManageCollectionPensionReq, ManageCollectionPensionSerializer } from '../../../../../dataModels/manageCollection-pension.model';
import { Injectable } from "@angular/core";
import { ApiRouter, StatusCode } from "../../../../../common/enums/enums";
import { HttpService } from "../../../../httpService";
import { ApiUrl } from "../../../../../common/constants/constants";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

const endPoint = ApiRouter.ApiRouter2 + '/mgo/cp/manageCpCollections?collection=cp_pension&qry=';

@Injectable()
export class ManageCollectionPensionService extends HttpService<ManageCollectionPensionResp>  {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new ManageCollectionPensionSerializer()
    );
  }


  getCollectionPension(data: ManageCollectionPensionReq, cbResp: (res: ManageCollectionPensionResp) => void, cbErr?: (err: HttpErrorResponse) => void) {
    const reqData = {
      // "request.userDetails.idType": data.nationalIdType,
      "request.PolicyDetails.policyNo": data.policyNo,
    }

    super.queryString(JSON.stringify(reqData)).subscribe((resp: ManageCollectionPensionResp) => {
      console.log('getCollectionPension response -> ', resp);
      // if ((resp.statusCode == StatusCode.Status200)) {
        cbResp(resp)
      // }
    },
      (error: HttpErrorResponse) => {
        console.log('getCollectionPension error -> ', error);
        if (error.status == StatusCode.Status403) {
          cbErr(error);
        }
        else {
          cbErr(error);
        }
      });

  }

}
