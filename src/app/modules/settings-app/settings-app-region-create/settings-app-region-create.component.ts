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

import { Component, OnInit } from '@angular/core';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { RestService } from 'src/app/services/rest.service';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Router } from '@angular/router';
import { GlobalAppService } from 'src/app/services/global-app.service';

@Component({
  selector: 'app-settings-app-region-create',
  templateUrl: './settings-app-region-create.component.html',
  styleUrls: ['./settings-app-region-create.component.css']
})
export class SettingsAppRegionCreateComponent implements OnInit {

  // Autorizacion de localstorage
  authorization: string;
  // Nombre del formulario
  textForm = 'Nueva regional'; // i18n
  // Ruta a redirigir
  redirectionPath = '/setting/region-index';
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Configuración', 'route': '/setting' },
    { 'name': 'Principal y regionales', 'route': this.redirectionPath }
  ];
  breadcrumbRouteActive = 'Crear'; // i18n
  // Version api
  versionApi = environment.versionApiDefault;
  /**
   * Configuraciones para los servicios
   */
  resSerFormSubmit: any;
  resSerFormSubmitErr: any;

  constructor(public sweetAlertService: SweetAlertService, public restService: RestService, public lhs: LocalStorageService, private router: Router, public globalAppService: GlobalAppService) { }

  ngOnInit() {
    // Hace el llamado del token
    this.getTokenLS();
  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    // Se consulta si el token se envió como input //
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
    });
  }

  submitFormReceive(data) {

    this.sweetAlertService.sweetLoading();
    /**
     * Cargando true
     */
    /** Se reasigna el valor para enviar la estructura correcta al backend */

    this.restService.restPost( this.versionApi + 'configuracionApp/regionales/create', data, this.authorization)
      .subscribe((res) => {
        this.resSerFormSubmit = res;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerFormSubmit, false ).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            // Muestra el mensaje
            this.sweetAlertService.showNotification('success', this.resSerFormSubmit.message);
            // Redirecciona a la pagina principal
            this.router.navigate([ this.redirectionPath ]);
          }
          // Cargando false
          this.sweetAlertService.sweetClose();
        });
      }, (err) => {
        this.resSerFormSubmitErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerFormSubmitErr, false ).then((res) => { });
      }
    );
  }

}
