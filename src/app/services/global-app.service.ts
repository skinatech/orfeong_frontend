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
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalAppService {

  routeAssetsGlobalMenu: string;
  textLanguage: string;
  varTextError: string = 'Algo está mal';
  varTextResourseNotExist: string = 'El recurso solicitado no existe';
  varTextErrorConnection: string = 'Error de conexión';
  varTextErrorUnauthorized: string = 'Credenciales no válidas';
  resSerLenguage: any; // servicio de lenguaje
  resServices: any;
  resServicesErr: any;
  authorization: any;

  orfeoNgExpressVal = environment.orfeoNgExpress.ocultarModulos;

  constructor(private http: HttpClient, private router: Router, public sweetAlertService: SweetAlertService) { }

  subMenuGet() {

    if (localStorage.getItem('language')) {

      // Si el orfeo es express no se muestran ciertos modulos
      if(this.orfeoNgExpressVal == true){
        this.routeAssetsGlobalMenu = 'assets/globals/sub-menu-express-' + localStorage.getItem('language');
      }else{
        this.routeAssetsGlobalMenu = 'assets/globals/sub-menu-' + localStorage.getItem('language');
      }
    } else {
      
      // Si el orfeo es express no se muestran ciertos modulos
      if(this.orfeoNgExpressVal == true){
        this.routeAssetsGlobalMenu = 'assets/globals/sub-menu-express-' + 'es';
      }else{
        this.routeAssetsGlobalMenu = 'assets/globals/sub-menu-' + 'es';
      }
    }

    return new Promise(resolve => {
      this.http.get( this.routeAssetsGlobalMenu + '.json').subscribe(data => {
        resolve(data);
        // console.log(data);
      }, err => {
        // console.log(err);
      });
    });
  }

  manualesGet() {

    this.routeAssetsGlobalMenu = 'assets/globals/manuales';

    return new Promise(resolve => {
      this.http.get( this.routeAssetsGlobalMenu + '.json').subscribe(data => {
        resolve(data);
      }, err => {

      });
    });
  }

  /** Método para cerrar sesión */
  logout() {
    localStorage.removeItem( environment.hashSkina );
    localStorage.removeItem( environment.hashDataList );
    localStorage.removeItem( environment.hashDataListModule );
    localStorage.removeItem( environment.hashMenu );
    localStorage.removeItem( environment.dataIdDepe );
    // localStorage.removeItem( environment.hashMailSkina );
    localStorage.removeItem( environment.hashMailInitialListSkina );
    localStorage.removeItem( environment.hashDataFilter );
    localStorage.removeItem( environment.hashMenuButtonRadi );
    localStorage.removeItem( environment.hashMenuButtonRadiCor );
    localStorage.removeItem( environment.hashRadiAsociados );
    // Variable que crea una libreria al generar un PDF
    localStorage.removeItem( 'pdfjs.history' );
    this.router.navigate(['/login']);
  }

  /** Método para resolver la respuesta del un servicio que retorna status 200
   * @param dataResponse respuesta del servicio
   * @param isredirectionPath Define si se utiliza la redireccion en caso de no tener permisos de acceso
   * @param redirectionPath ruta a redirigir en caso de que el usuario no posea permisos para realizar la accion
   */
  resolveResponse(dataResponse: any, isredirectionPath: boolean = false , redirectionPath: string = '/dashboard'){
    return new Promise(resolve => {
      // Start text18nGet
      this.text18nGet().then((res) => {
        this.resSerLenguage = res;
        // Asignación de los mensajes según el idioma
        this.varTextError = this.resSerLenguage['varTextError'];
        this.varTextResourseNotExist = this.resSerLenguage['varTextResourseNotExist'];
        this.varTextErrorConnection = this.resSerLenguage['varTextErrorConnection'];

        if (dataResponse.status == environment.statusErrorValidacion) {
          this.sweetAlertService.sweetInfo( this.varTextError, dataResponse.data);
          if (isredirectionPath) {
            this.router.navigate([redirectionPath]);
          }
          resolve(false);
        } else if (dataResponse.status == environment.statusErrorAccessDenied) {
          this.sweetAlertService.sweetInfo( this.varTextError, { error: dataResponse.message});
          if (isredirectionPath) {
            this.router.navigate([redirectionPath]);
          }
          resolve(false);
        } else {
          resolve(true);
        }

      });
      // End text18nGet
    });
  }

  /** Método para resolver la respuesta del un servicio que retorna status de error
   * @param dataResponse respuesta del servicio
   * @param isredirectionPath Define si se utiliza la redireccion en caso de no tener permisos de acceso
   * @param redirectionPath ruta a redirigir en caso de que el usuario no posea permisos para realizar la accion
   */
  resolveResponseError(dataResponse: any, isredirectionPath: boolean = false , redirectionPath: string = '/dashboard'){

      return new Promise(resolve => {
        this.text18nGet().then((res) => {
          this.resSerLenguage = res;
          // Asignación de los mensajes según el idioma
          this.varTextError = this.resSerLenguage['varTextError'];
          this.varTextResourseNotExist = this.resSerLenguage['varTextResourseNotExist'];
          this.varTextErrorConnection = this.resSerLenguage['varTextErrorConnection'];
          this.varTextErrorUnauthorized = this.resSerLenguage['varTextErrorUnauthorized'];

          if (dataResponse.status == environment.statusErrorBadRequest) {
            let msgError = {
              error: this.varTextResourseNotExist
            };
            this.sweetAlertService.sweetInfo( this.varTextError, msgError );
            if (isredirectionPath) {
              this.router.navigate([redirectionPath]);
            }
            resolve(false);
          } else if(dataResponse.status == environment.statusErrorUnauthorized) {
            let msgError = {
              error: this.varTextErrorUnauthorized
            };
            this.sweetAlertService.sweetInfo( this.varTextError, msgError );
            resolve(true);
          } else {
            let msgError = {
              error: this.varTextErrorConnection
            };
            this.sweetAlertService.sweetInfo( this.varTextError, msgError );
            resolve(true);
          }
        });
      });
  }

  /** Trae los textos del idiona dependiendo lo caque trae en el localStorage */
  text18nGet() {

    if (localStorage.getItem('language')) {
      this.textLanguage = 'assets/i18n/' + localStorage.getItem('language');
    } else {
      this.textLanguage = 'assets/i18n/' + 'es';
    }

    return new Promise(resolve => {
      this.http.get( this.textLanguage + '.json').subscribe(data => {
        resolve(data);
        // console.log(data);
      }, err => {
        // console.log(err);
      });
    });
  }

}
