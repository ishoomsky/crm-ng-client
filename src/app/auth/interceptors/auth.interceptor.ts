import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  req = req.clone({
    setHeaders: {
      Authorization: token ?? '[]',
    }
  });

  const authReq = req = req.clone({
    setHeaders: {
      Authorization: token ?? '[]',
    }
  });
  //TODO Interceptor error handling
  return next(authReq)
  //   .pipe(
  //   catchError((err: any) => {
  //     if (err instanceof HttpErrorResponse) {
  //       // Handle HTTP errors
  //       if (err.status === 401) {
  //         // Specific handling for unauthorized errors
  //         console.error('Unauthorized request:', err);
  //         // You might trigger a re-authentication flow or redirect the user here
  //       } else {
  //         // Handle other HTTP error codes
  //         console.error('HTTP error:', err);
  //       }
  //     } else {
  //       // Handle non-HTTP errors
  //       console.error('An error occurred:', err);
  //     }
  //
  //     // Re-throw the error to propagate it further
  //     return throwError(() => err);
  //   })
  // );
};
