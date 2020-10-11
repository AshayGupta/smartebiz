import { map, timeout, retryWhen, scan, delay } from 'rxjs/operators';
import { Observable } from "rxjs";
import { ApiResource, Serializer } from "../common/interfaces/serializer";
import { LocalStorageKey } from "../common/enums/enums";
import { HttpClient, HttpHeaders } from '@angular/common/http';

export class HttpService<T extends ApiResource> {

    private url: string;

    constructor(
        private http: HttpClient,
        private baseUrl: string,
        private endPoint: string,
        private serializer: Serializer,
    ) {
        this.url = this.baseUrl + this.endPoint;
        console.log('url -> ', this.url);
    }

    protected header() {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            // 'Access-Control-Allow-Origin':'*',
            'Authorization': 'Bearer ' + localStorage.getItem(LocalStorageKey.BearerToken)
        });
        let options = {
            headers: httpHeaders
        };
        return options;
    }

    protected create(body: any): Observable<T> {
        return this.http
            .post(this.url,
                this.serializer.toJson(body),
                this.header()
            )
            .pipe(timeout(180000), map(res => this.serializer.fromJson(res) as T))
            .catch(error => {
                if (error.name === "TimeoutError") {
                    localStorage.setItem(LocalStorageKey.Timeout, 'true');
                    return Observable.throw(error);
                }
                return Observable.throw(error);
            });
    }

    protected read(): Observable<T> {
        return this.http
            .get(this.url, this.header())
            .pipe(timeout(180000), map(res => this.serializer.fromJson(res) as T))
    }

    protected update(body: any): Observable<T> {
        return this.http
            .put(this.url,
                this.serializer.toJson(body),
                this.header()
            )
            .pipe(timeout(180000), map(res => res as T));
    }


    // protected update(body: T): Observable<T> {
    //     return this.http
    //         .put(this.baseUrl + this.endPoint,
    //             this.serializer.toJson(body))
    //         .pipe(map(res => this.serializer.fromJson(res) as T));
    // }

    // protected delete(id: number) {
    //     return this.http
    //         .delete(this.baseUrl + this.endPoint);
    // }

    protected queryString(queryUrl: string): Observable<any> {
        console.log('queryString url -> ', this.url + queryUrl);
        return this.http
            .get(this.url + queryUrl, this.header())
            .pipe(timeout(180000), map(res => this.serializer.fromJson(res) as T));
    }




    // Logon service to get bearer token from api and store it in local storage
    protected logonService(): Observable<T> {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('mT1Kr' + ':' + 'B1-o9CzS7')
        });
        let options = {
            headers: httpHeaders
        };

        return this.http
            .post(this.url,
                {},
                options
            )
            .pipe(this.handleRetry, map(res => this.serializer.fromJson(res) as T));
    }

    // Retry logon service 3 times if token is not get and then call intented API
    private handleRetry<T>(source: Observable<T>): Observable<T> {
        return source.pipe(retryWhen(e => e.pipe(scan((errorCount, error) => {
            if (errorCount >= 2) {
                throw error;
            }
            return errorCount + 1;
        }, 0),
            delay(3000)
        )));
    }


}
