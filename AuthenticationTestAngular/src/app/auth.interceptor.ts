import { HttpInterceptorFn } from '@angular/common/http';


export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const apiUrl = "https://localhost:7052";
  const fullUrl = req.url.startsWith('http') ? req.url : `${apiUrl}/${req.url}`;

  const newReq = req.clone({
    url: fullUrl,
    headers: req.headers.append('X-Test', 'Test message'),
    withCredentials: true
  });

  return next(newReq);
};
