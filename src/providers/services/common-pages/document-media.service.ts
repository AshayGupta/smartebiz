import { Injectable } from "@angular/core";
import { ApiRouter, StatusCode } from "../../../common/enums/enums";
import { HttpService } from "../../httpService";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ApiUrl } from "../../../common/constants/constants";
import { DocumentMediaResp, DocumentMediaSerializer, DocumentMediaReq } from "../../../dataModels/document-media.model";

const endPoint = ApiRouter.ApiRouter2 + 'lfr/cust/getDocument';

@Injectable()
export class DocumentMediaService extends HttpService<DocumentMediaResp> {

    constructor(http: HttpClient) {
        super(
            http,
            ApiUrl.baseUrl,
            endPoint,
            new DocumentMediaSerializer()
        );
    }

    getDocument(data: DocumentMediaReq, cbResp: (res: DocumentMediaResp) => void, cbErr?: (err: HttpErrorResponse) => void) {
        super.create(data).subscribe((resp: DocumentMediaResp) => {
            console.log('getDocument response -> ', resp);
            if (resp.statusCode == StatusCode.Status200) {
                cbResp(resp);
            }
        },
            error => {
                console.log('getDocument error -> ', error);
                // if (error.status == StatusCode.Status403) {
                    cbErr(error);
                // }
            })
    }

}