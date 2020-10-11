import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { LoaderService } from '../plugin-services/loader.service';
import { tap } from 'rxjs/operators';
import { LocalStorageKey } from '../../common/enums/enums';


@Injectable()
export class HttpRequestResponseInterceptor implements HttpInterceptor {

  constructor(
    private loaderService: LoaderService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('HttpRequestResponseInterceptor ... ');

    if (
      request.url.toString().includes('apps/logon') ||
      // request.url.toString().includes('getClientDetails') ||
      request.url.toString().includes('makepayment')
    ) {
      return next.handle(request);
    }

    this.loaderService.showLoader();

    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // console.log('HttpResponse --->>>', event);
            this.loaderService.dismissLoader();
          }
        },
        (err: Error) => {
          this.loaderService.dismissLoader();
          // if (err instanceof HttpErrorResponse) {
          //   console.log('HttpErrorResponse -> ', err)
          //   this.loaderService.dismissLoader();
          // }
        }
      )
    );

  }


}