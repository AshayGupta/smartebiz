import { AmcMongoStagesSerializer, AmcMongoStagesReq, AmcMongoStagesResp } from './../../../../dataModels/amc-mongo-stages.model';
import { ApiUrl } from './../../../../common/constants/constants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../common/enums/enums';
import { HttpService } from '../../../httpService';


const endPoint = ApiRouter.ApiRouter2 + 'mgo/cp/manageCpCollections';

@Injectable()
export class AmcMongoStagesService extends HttpService<AmcMongoStagesResp>  {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new AmcMongoStagesSerializer()
    );
  }

  createAmcMongoStage(data: any, cbResp: (res: AmcMongoStagesResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp) => {
      console.log('createAmcMongoStage response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200)) {
        cbResp(resp)
      }
    },
      error => {
        console.log('createAmcMongoStage error -> ', error);
        // if (error.status == StatusCode.Status403) {
        //   cbErr(true);
        // }
      });

  }

  updateAmcMongoStage(data: any, cbResp: (res: any) => void, cbErr?: (err: boolean) => void) {
    super.update(data).subscribe((resp) => {
      console.log('updateAmcMongoStage response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200)) {
        cbResp(resp)
      }
    },
      error => {
        console.log('updateAmcMongoStage error -> ', error);
        // if (error.status == StatusCode.Status403) {
        //   cbErr(true);
        // }
      });

  }

}
