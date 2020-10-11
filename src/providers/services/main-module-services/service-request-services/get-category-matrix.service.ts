import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../common/enums/enums';
import { HttpService } from '../../../httpService';
import { ApiUrl } from '../../../../common/constants/constants';
import { CategoryMatrixResp, CategoryMatrixReq, CategoryMatrixSerializer } from '../../../../dataModels/category-matrix.model';


const endPoint = ApiRouter.ApiRouter2 + 'mgo/cp/manageCpCollections?collection=sr_category_matrixV2&qry=';

@Injectable()
export class CategoryMatrixService extends HttpService<CategoryMatrixResp>  {

    constructor(http: HttpClient) {
        super(
            http,
            ApiUrl.baseUrl,
            endPoint,
            new CategoryMatrixSerializer()
        );
    }

    getCategoryMatrixData(data: CategoryMatrixReq, cbResp: (res: CategoryMatrixResp) => void, cbErr?: (err: boolean) => void) {
        console.log('CategoryMatrixReq -> ', data);

        const reqData = {
            "LOB": data.lob,
            "Action": data.action
        }

        super.queryString(JSON.stringify(reqData)).subscribe((resp: CategoryMatrixResp) => {
            console.log('getCategoryMatrixData response -> ', resp);
            if ((resp.statusCode == StatusCode.Status200)) {
                cbResp(resp)
            }
        },
            error => {
                console.log('getCategoryMatrixData error -> ', error);
                if (error.status == StatusCode.Status403) {
                    cbErr(true);
                }
            });
    }

}
