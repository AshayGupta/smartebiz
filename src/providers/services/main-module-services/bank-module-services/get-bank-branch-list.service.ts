import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../common/enums/enums';
import { HttpService } from '../../../httpService';
import { ApiUrl } from '../../../../common/constants/constants';
import { BranchListResp, BranchListReq,BranchListSerializer } from '../../../../dataModels/get-bank-branch-list.model';


const endPoint = ApiRouter.ApiRouter2 + 'esb/amcBuyOnline/getBankBranchList';

@Injectable()
export class BankBranchListService extends HttpService<BranchListResp>  {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new BranchListSerializer()
    );
  }

  getBranchList(data: BranchListReq, cbResp: (res: BranchListResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: BranchListResp) => {
      console.log('getBranchList response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200)) {
        cbResp(resp)
      }
    },
      error => {
        console.log('getBranchList error -> ', error);
        // if (error.status == StatusCode.Status403) {
        //   cbErr(true);
        // }
      });
  }

}
