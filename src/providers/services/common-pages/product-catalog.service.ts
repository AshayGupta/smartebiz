import { HttpClient } from '@angular/common/http';
import { ApiRouter, StatusCode } from "../../../common/enums/enums";
import { Injectable } from "@angular/core";
import { HttpService } from "../../httpService";
import { ApiUrl } from "../../../common/constants/constants";
import { ProductCatalogResp, ProductCatalogSerializer } from '../../../dataModels/product-catalog.model';

const endPoint = ApiRouter.ApiRouter1 + 'sb/getProductCatalog';

@Injectable()
export class ProductCatalogService extends HttpService<ProductCatalogResp> {

    constructor(http: HttpClient) {
        super(
            http,
            ApiUrl.baseUrl,
            endPoint,
            new ProductCatalogSerializer()
        );
    }

    getProductCatalog(cbResp: (res: ProductCatalogResp) => void, cbErr?: (err: boolean) => void) {
        super.read().subscribe((resp: ProductCatalogResp) => {
            console.log('getProductCatalog response -> ', resp);
            if (resp.statusCode == StatusCode.Status200 && resp) {
                cbResp(resp);
            }
        },
            error => {
                console.log('getProductCatalog error -> ', error);
                if (error.status == StatusCode.Status403) {
                    cbErr(true);
                }
            });
    }



}
