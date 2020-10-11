import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActionItemsResp, ActionItemsReq, ProductActionItemsSerializer } from '../../../../dataModels/product-action-items.model';
import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../../common/constants/constants';
import { HttpService } from '../../../httpService';
import { ApiRouter, StatusCode } from '../../../../common/enums/enums';

const endPoint = ApiRouter.ApiRouter2 + 'mgo/cp/manageCpCollections?collection=cp_product&qry=';

@Injectable()
export class GetProductService extends HttpService<ActionItemsResp> {

    constructor(http: HttpClient) {
        super(
            http,
            ApiUrl.baseUrl,
            endPoint,
            new ProductActionItemsSerializer()
        );
    }

    getProduct(data: ActionItemsReq,cbResp: (res: ActionItemsResp) => void, cbErr?: (err: HttpErrorResponse) => void) {
      const reqData = {
        "srcLob": data.lobSrc,
        }

        super.queryString(JSON.stringify(reqData)).subscribe((resp: ActionItemsResp) => {
          console.log('getProduct response -> ', resp);
          if ((resp.statusCode == StatusCode.Status200)) {
            cbResp(resp)
          }
        },
          (error: HttpErrorResponse) => {
            console.log('getProduct error -> ', error);
            if (error.status == StatusCode.Status403) {
              cbErr(error);
            }
          });

    }

}

