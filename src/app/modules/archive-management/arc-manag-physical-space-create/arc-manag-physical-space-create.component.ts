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
  selector: 'app-arc-manag-physical-space-create',
  templateUrl: './arc-manag-physical-space-create.component.html',
  styleUrls: ['./arc-manag-physical-space-create.component.css']
})
export class ArcManagPhysicalSpaceCreateComponent implements OnInit {

  // Autorizacion de localstorage
  authorization: string;
  // Muestra el boton de agregar edificio
  statusButtonAdd = true;
  // Ruta a redirigir
  redirectionPath = '/archiveManagement/physical-space-index';
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Gestión de archivo', 'route': '/archiveManagement' },
    { 'name': 'Asignación de espacio físico', 'route': this.redirectionPath }
  ];
  breadcrumbRouteActive = 'Crear'; // i18n
  initialNotificationStatus: boolean = true; // muestra la notificacion
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

    // Valida que llegue los pisos por defecto llega un valor vacio.
    if ( data['numeroGaPiso'].length < 1 ) {
      this.sweetAlertService.text18nGet().then( (res) => {
        const dataLang = res;
        this.sweetAlertService.sweetInfo('Algo está mal', [dataLang['Debe agregar mínimo un piso']]);
      });
    } else {

      // Cargando true
      this.sweetAlertService.sweetLoading();
      /** Se reasigna el valor para enviar la estructura correcta al backend */

      this.restService.restPost( this.versionApi + 'gestionArchivo/espacio-fisico/create', data, this.authorization)
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
      });

    }

  }

}
