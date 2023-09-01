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
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { RestService } from '../../../services/rest.service';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Router } from '@angular/router';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { EncryptService } from 'src/app/services/encrypt.service';


@Component({
  selector: 'app-users-users-create',
  templateUrl: './users-users-create.component.html',
  styleUrls: ['./users-users-create.component.css']
})
export class UsersUsersCreateComponent implements OnInit {

  // Autorizacion de localstorage
  authorization: string;
  // Nombre del boton
  textButtonForm = 'Crear'; //i18n
  // Nombre del formulario
  textFormRol = 'Nuevo usuario'; //i18n
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Gestión de usuarios', 'route': '/users' },
    { 'name': 'Administrar usuarios', 'route': '/users/users-index/false' }
  ];
  breadcrumbRouteActive = 'Crear'; //i18n
  /**
   * Configuraciones para los servicios
   */
  responseServiceFormSubmit: any;
  responseServiceFormSubmitErr: any;
  responseService: any;
  responseServiceErr: any;
  urlEndSend: any;
  responseServiceDecrypt: any;

  dataListModuleName: any;
  dataListModuleNameNoAES: any;

  constructor(public sweetAlertService: SweetAlertService, public restService: RestService, public lhs: LocalStorageService, private router: Router, public globalAppService: GlobalAppService,
  private encryptService: EncryptService, private http: HttpClient) { }

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
    
    // Cargando true
    this.sweetAlertService.sweetLoading();
    this.encryptService.generateRouteGetParams( environment.apiUrl + environment.versionApiDefault + 'user/create', data.dataForm, this.authorization).then((res) => {
      this.urlEndSend = res;

      /** Comsumo de servicio  */
      this.http.post(this.urlEndSend, data.dataFile, {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + this.authorization,
          'language': localStorage.getItem('language') ? localStorage.getItem('language') : 'es'
        }),
        reportProgress: true,
        observe: 'events'

      }).subscribe((event: any) => {
        switch (event.type) {
          case HttpEventType.UploadProgress: // Cuando el archivo está siendo cargado
          break;
          case HttpEventType.Response: // Cuando termina la carga
              if (event.body) {
                this.responseServiceFormSubmit = event.body;
                // Desencriptar respuesta del servicio
                this.encryptService.decryptAES(this.responseServiceFormSubmit.encrypted, this.authorization).then((res) => {
                  this.responseServiceDecrypt = res;
                  // console.log(this.responseServiceDecrypt);
                  // Evaluar respuesta del servicio
                  this.globalAppService.resolveResponse(this.responseServiceDecrypt, false).then((res) => {
                    let responseResolveResponse = res;

                    if (responseResolveResponse == true) {
                      this.sweetAlertService.showNotification('success', this.responseServiceDecrypt.message);

                      // Actualiza el localstorage para los listados 
                      this.dataListModuleName = localStorage.getItem(environment.hashDataListModule);
                      this.dataListModuleNameNoAES = this.restService.decryptAES(this.dataListModuleName, this.authorization);

                      if (this.dataListModuleNameNoAES == this.responseServiceDecrypt.dataModule) {
                        localStorage.removeItem( environment.hashDataList );
                        this.restService.decryptAES(this.responseServiceDecrypt.dataListUser, this.authorization);
                      }
                      // Fin actualiza el localstorage para los listados 

                      // Cargando false
                      this.sweetAlertService.sweetClose();
                      // Redirecciona a la pagina principal
                      this.router.navigate(['/users/users-index/false']);
                    }
                  });
                  // Fin Evaluar respuesta del servicio
                });
                // Fin Desencriptar respuesta del servicio
              }
          break;
        }

      }, (err) => {
        this.responseServiceErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.responseServiceErr, false ).then((res) => { });
        this.sweetAlertService.sweetInfoText('El archivo no pudo ser procesado', '');
      });
      /** Fin Comsumo de servicio  */

    });
  }

}
