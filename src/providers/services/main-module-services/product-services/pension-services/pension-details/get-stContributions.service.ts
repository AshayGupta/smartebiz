import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../../../common/enums/enums';
import { HttpService } from '../../../../../httpService';
import { ApiUrl } from '../../../../../../common/constants/constants';
import { ContributionsResp, ContributionsSerializer, ContributionsReq } from '../../../../../../dataModels/getStContributions.model';

const endPoint = ApiRouter.ApiRouter2 + 'esb/pension/getStContributions';

@Injectable()
export class GetStContributionsService extends HttpService<ContributionsResp> {

    constructor(http: HttpClient) {
        super(
            http,
            ApiUrl.baseUrl,
            endPoint,
            new ContributionsSerializer()
        );
    }

    getContributions(data: ContributionsReq, cbResp: (res) => void, cbErr?: (err: boolean) => void) {
        super.create(data).subscribe((resp) => {
            console.log('getContributions response ->', resp);
            if ((resp.statusCode == StatusCode.Status200)) {
                cbResp(resp);
            }
        },
            error => {
                console.log('getContributions error -> ', error);
                if (error.status == StatusCode.Status403) {
                    cbErr(true);
                }
            });
    }

}

