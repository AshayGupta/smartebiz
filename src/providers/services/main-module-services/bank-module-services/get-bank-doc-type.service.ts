import { ManageCollectionDocTypeReq,ManageCollectionDocTypeResp,ManageCollectionDocTypeSerializer } from '../../../../dataModels/get-bank-docType.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../common/enums/enums';
import { HttpService } from '../../../httpService';
import { ApiUrl } from '../../../../common/constants/constants';


const endPoint = ApiRouter.ApiRouter2 + 'mgo/cp/manageCpCollections?collection=cp_getDocType';

@Injectable()
export class ManageCollectionDocTypeService extends HttpService<ManageCollectionDocTypeResp>  {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new ManageCollectionDocTypeSerializer()
    );
  }

  getDocType(cbResp: (res: ManageCollectionDocTypeResp) => void, cbErr?: (err: boolean) => void) {
    super.read().subscribe((resp: ManageCollectionDocTypeResp) => {
      console.log('getDocType response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200)) {
        cbResp(resp)
      }
    },
      error => {
        console.log('getDocType error -> ', error);
        // if (error.status == StatusCode.Status403) {
        //   cbErr(true);
        // }
      });
  }

}
