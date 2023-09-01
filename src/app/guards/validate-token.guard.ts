/**
 * Que es este módulo o Archivo
 *
 * Descripcion Larga
 *
 * @category     Gestion Documental
 * @package      Orfeo NG 
 * @subpackage   XXXX 
 * @author       Skina Technologies SAS (http://www.skinatech.com)
 * @license      Mixta <https://orfeolibre.org/inicio/licencia-de-orfeo-ng/>
 * @license      LICENSE.md
 * @link         http://www.orfeolibre.org
 * @since        Archivo disponible desde la version 1.0.0
 *
 * @copyright    2023 Skina Technologies SAS
 */

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { catchError, map, } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

/**
 * Imortanción de servicios
 */
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ValidateTokenGuard implements CanActivate {

  hashLocalStorage: any;

  constructor(public authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.hashLocalStorage = localStorage.getItem(environment.hashSkina);

    if(this.hashLocalStorage != null) {
      return this.authService.isAuthenticated(this.hashLocalStorage)
      .pipe(
        map(response => {
          return true;
        }),
        catchError((err) => {
          this.router.navigate(['/login']);
          return of(false);
        })
      );
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
