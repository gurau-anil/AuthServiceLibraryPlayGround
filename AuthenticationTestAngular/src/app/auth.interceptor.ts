import { HttpInterceptorFn } from '@angular/common/http';


export const AuthInterceptor: HttpInterceptorFn = (req, next) => {

  const newReq = req.clone({
    headers: req.headers.append('X-Test', 'Test message'),
    withCredentials : true
  });

  return next(newReq);
};
