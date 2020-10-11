import { ApiRouter, StatusCode } from "../../../common/enums/enums";
import { Injectable } from "@angular/core";
import { HttpService } from "../../httpService";
import { ApiUrl } from "../../../common/constants/constants";
import { HttpClient } from "@angular/common/http";
import { LocateBranchResp, LocateBranchReq, LocateBranchSerializer } from "../../../dataModels/locate-branch.model";


const endPoint = ApiRouter.ApiRouter2 + 'lfr/core/locateBranch';

@Injectable()
export class BranchLocatorService extends HttpService<LocateBranchResp> {

    constructor(http: HttpClient) {
        super(
            http,
            ApiUrl.baseUrl,
            endPoint,
            new LocateBranchSerializer()
        );
    }

    locateBranch(data: LocateBranchReq, cbResp: (res: LocateBranchResp) => void, cbErr?: (err: boolean) => void) {
        super.read().subscribe((resp: LocateBranchResp) => {
            console.log('locateBranch response -> ', resp);
            if (resp.statusCode == StatusCode.Status200 && resp) {
                cbResp(resp);
            }
        },
            error => {
                console.log('locateBranch error -> ', error);
                if (error.status == StatusCode.Status403) {
                    cbErr(true);
                }
            })
    }

}
