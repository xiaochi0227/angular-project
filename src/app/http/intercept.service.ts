import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class InterceptService implements HttpInterceptor {
  constructor(private logger: NGXLogger) {

  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    if (token && req.url.indexOf('.json') < 0 && req.url.indexOf('images-m-glory.oss') < 0) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        }
      });
    }
    if (req.url.indexOf('images-m-glory.oss') > 0 && req.body && req.body.get('file')) {
      const f = req.body.get('file');
      req.body.delete('file');
      req.body.set('file', f);
    }
    return next.handle(req).pipe(tap(
      event => {
        if (event instanceof HttpResponse) {
          // this.logger.debug(event.url + ': status:' + event.status);
        }
      }, error => {
        this.logger.error('http error message :' + error.message);
      })
    );
  }
}
