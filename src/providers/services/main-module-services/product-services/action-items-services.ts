import { HttpClient } from '@angular/common/http';
import { ActionItemsResp, ActionItemsReq, ProductActionItemsSerializer } from '../../../../dataModels/product-action-items.model';
import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../../common/constants/constants';
import { HttpService } from '../../../httpService';
import { ApiRouter, StatusCode } from '../../../../common/enums/enums';

const endPoint = ApiRouter.ApiRouter2 + 'esb/products/getProducts';

@Injectable()
export class ActionItemsService extends HttpService<ActionItemsResp> {

    constructor(http: HttpClient) {
        super(
            http,
            ApiUrl.baseUrl,
            endPoint,
            new ProductActionItemsSerializer()
        );
    }

    getActionItems(data: ActionItemsReq, cbResp: (res: ActionItemsResp) => void, cbErr?: (err: boolean) => void) {
        super.create(data).subscribe((resp: ActionItemsResp) => {
            console.log('actionItems response ->', resp);
            if ((resp.statusCode == StatusCode.Status200)) {
                cbResp(resp);
            }
        },
            error => {
                console.log('actionItems error -> ', error);
                if (error.status == StatusCode.Status403) {
                    cbErr(true);
                }
            });
    }

}

