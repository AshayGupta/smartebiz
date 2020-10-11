import { HttpClient } from '@angular/common/http';
import { HtmlContentResp, HtmlContentSerializer, HtmlContentReq } from './../../../dataModels/html-content.model';
import { ApiRouter, StatusCode } from "../../../common/enums/enums";
import { Injectable } from "@angular/core";
import { HttpService } from "../../httpService";
import { ApiUrl } from "../../../common/constants/constants";

const endPoint = ApiRouter.ApiRouter2 + 'lfr/core/pullContent';

@Injectable()
export class HtmlContentService extends HttpService<HtmlContentResp> {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new HtmlContentSerializer()
    );
  }

  getHtmlFromServer(data: HtmlContentReq, cbResp: (res: HtmlContentResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: HtmlContentResp) => {
      console.log('getHtmlFromServer response -> ', resp);
      if (resp.statusCode == StatusCode.Status200 && resp) {
        cbResp(resp);
      }
    },
      error => {
        console.log('getHtmlFromServer error -> ', error);
        if (error.status == StatusCode.Status403) {
          cbErr(true);
        }
      });
  }



}
