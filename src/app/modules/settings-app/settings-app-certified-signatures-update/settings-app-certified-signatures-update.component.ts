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
import { GlobalAppService } from 'src/app/services/global-app.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConvertParamsBase64Helper } from 'src/app/helpers/convert-params-base64.helper';

@Component({
  selector: 'app-settings-app-certified-signatures-update',
  templateUrl: './settings-app-certified-signatures-update.component.html',
  styleUrls: ['./settings-app-certified-signatures-update.component.css']
})
export class SettingsAppCertifiedSignaturesUpdateComponent implements OnInit {

  // Autorizacion de localstorage
  authorization: string;
  // variable que guarda el id que llega por Get
  paramiD: string;
  paramOID: string;
  // Nombre del formulario
  textForm = 'Actualizar de Proveedor Firma Certificada'; // i18n
  // Ruta a redirigir
  initCardHeaderIcon = 'verified_user';
  // Ruta a redirigir
  redirectionPath = '/setting/certified-signatures-index';
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Configuración', 'route': '/setting' },
    { 'name': 'Proveedor Firma Certificada', 'route': this.redirectionPath }
  ];
  breadcrumbRouteActive = 'Actualizar'; // i18n

  // Version api
  versionApi = environment.versionApiDefault;
  /**
   * Configuraciones para los servicios
   */
  resSerFormSubmit: any;
  resSerFormSubmitErr: any;

  constructor(public sweetAlertService: SweetAlertService, public restService: RestService, public lhs: LocalStorageService, private router: Router,
    private route: ActivatedRoute, public globalAppService: GlobalAppService) {

      // Se recibe el id
    this.paramiD = this.route.snapshot.paramMap.get('id');
    // Se pasa al html como componete para que reciba el ID
    this.paramOID = ConvertParamsBase64Helper(this.paramiD);
    }

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

    /** Se asigna el valor del id que se está actualizando */
    data['id'] = this.paramOID;

    // Cargando true
    this.sweetAlertService.sweetLoading();

    this.restService.restPut( this.versionApi + 'configuracionApp/cg-firmas-certificadas/update', data, this.authorization)
      .subscribe((res) => {
        this.resSerFormSubmit = res;

        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerFormSubmit, false).then((res) => {
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
