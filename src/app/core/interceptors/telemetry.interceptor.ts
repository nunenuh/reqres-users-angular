import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { trace, context, SpanStatusCode } from '@opentelemetry/api';

@Injectable()
export class TelemetryInterceptor implements HttpInterceptor {
  private readonly tracer = trace.getTracer('http-interceptor');

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return new Observable((subscriber) => {
      const span = this.tracer.startSpan(
        `HTTP ${request.method} ${request.url}`,
        {
          attributes: {
            'http.method': request.method,
            'http.url': request.url,
            'http.target': new URL(request.url).pathname,
          },
        },
        context.active()
      );

      const subscription = next.handle(request).pipe(
        tap({
          next: (event) => {
            if (event instanceof HttpResponse) {
              span.setAttributes({
                'http.status_code': event.status,
                'http.status_text': event.statusText,
              });
              span.setStatus({ code: SpanStatusCode.OK });
            }
          },
          error: (error) => {
            span.setAttributes({
              'http.status_code': error.status,
              'error.type': error.name,
              'error.message': error.message,
            });
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: error.message,
            });
          },
          complete: () => {
            span.end();
          },
        })
      ).subscribe({
        next: (value) => subscriber.next(value),
        error: (err) => subscriber.error(err),
        complete: () => subscriber.complete(),
      });

      return () => {
        subscription.unsubscribe();
        span.end();
      };
    });
  }
} 