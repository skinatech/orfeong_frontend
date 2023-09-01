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
  selector: 'app-doc-manag-dependencies-update',
  templateUrl: './doc-manag-dependencies-update.component.html',
  styleUrls: ['./doc-manag-dependencies-update.component.css']
})
export class DocManagDependenciesUpdateComponent implements OnInit {

  // Autorizacion de localstorage
  authorization: string;
  // variable que guarda el id que llega por Get
  paramiD: string;
  paramOID: string;
  // Nombre del formulario
  textForm = 'Actualizar dependencia'; // i18n
  // Redired path
  redirectionPath = '/documentManagement/dependencies-index';
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Gestión documental', 'route': '/documentManagement' },
    { 'name': 'Dependencias', 'route': this.redirectionPath }
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

   // console.log(data);

    this.restService.restPut( this.versionApi + 'gestionDocumental/trd-dependencias/update', data, this.authorization)
      .subscribe((res) => {
        this.resSerFormSubmit = res;

        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerFormSubmit, false).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {

            // Guarda en el local storage el mensaje
            localStorage.setItem('setFlashText', this.resSerFormSubmit.message);
            // Redirecciona a la pagina principal
            this.router.navigate([ this.redirectionPath ]);
            // Cargando false
            this.sweetAlertService.sweetClose();
          }
        });
      }, (err) => {
        this.resSerFormSubmitErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerFormSubmitErr, false ).then((res) => { });
      }
    );
  }

}
