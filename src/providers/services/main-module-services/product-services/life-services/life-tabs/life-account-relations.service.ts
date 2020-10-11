import { LifeAccountRelationsResp, LifeAccountRelationsReq, LifeAccountRelationsSerializer } from './../../../../../../dataModels/life-account-relations.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../../../common/enums/enums';
import { ApiUrl } from '../../../../../../common/constants/constants';
import { HttpService } from '../../../../../httpService';


const endPoint = ApiRouter.ApiRouter2 + 'esb/life/getAccountRelations';

@Injectable()
export class LifeAccountRelationsService extends HttpService<LifeAccountRelationsResp> {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new LifeAccountRelationsSerializer()
    );
  }

  getAccountRelations(data: LifeAccountRelationsReq, cbResp: (res: LifeAccountRelationsResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: LifeAccountRelationsResp) => {
      console.log('getAccountRelations response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200) && resp.accountRelations.length > 0) {
        cbResp(resp)
      }
    },
      error => {
        console.log('getAccountRelations error -> ', error);
        if (error.status == StatusCode.Status403) {
          cbErr(true);
        }
      });
  }

}
