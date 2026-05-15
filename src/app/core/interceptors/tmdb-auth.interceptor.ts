import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const tmdbAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authReq = req.clone({
    params: req.params
      .set('api_key', environment.tmdbToken)
      .set('language', 'es-ES')
  });
  return next(authReq);
};
