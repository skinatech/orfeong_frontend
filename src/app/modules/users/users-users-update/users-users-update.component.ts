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
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { RestService } from 'src/app/services/rest.service';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConvertParamsBase64Helper } from 'src/app/helpers/convert-params-base64.helper';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { EncryptService } from 'src/app/services/encrypt.service';

/**
 * Importación del servidor sockect
 */
import { SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-users-users-update',
  templateUrl: './users-users-update.component.html',
  styleUrls: ['./users-users-update.component.css']
})
export class UsersUsersUpdateComponent implements OnInit {

  /**
   * Data User
   */
  userData: any;

  // Nombre del boton
  textButtonForm = 'Actualizar';
  // Nombre del formulario
  textFormRol = 'Modificar usuario';
  // Autentificacion
  authorization: string;
  // variable que guarda el id que llega por Get
  paramiD: string;
  paramOID: string;
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Gestión de usuarios', 'route': '/users' },
    { 'name': 'Administrar usuarios', 'route': '/users/users-index/false' }
  ];
  breadcrumbRouteActive = 'Actualizar';

  /**
   * Configuraciones para los servicios
   */
  responseServiceFormSubmit: any;
  responseServiceFormSubmitErr: any;
  responseService: any;
  responseServiceErr: any;
  responseServiceDecrypt: any;
  urlEndSend: any;

  dataListModuleName: any;
  dataListModuleNameNoAES: any;

  constructor(public sweetAlertService: SweetAlertService, public restService: RestService, public lhs: LocalStorageService, private router: Router, private route: ActivatedRoute, public globalAppService: GlobalAppService,
    private socketioService: SocketioService, private encryptService: EncryptService, private http: HttpClient) {
    this.paramiD = this.route.snapshot.paramMap.get('id'); // Se recibe el id
    this.paramOID = ConvertParamsBase64Helper(this.paramiD); // Se pasa al html como componete para que reciba el ID
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

    /** Se asigna el valor del id del usuario que se está actualizando */
    data.dataForm['id'] = this.paramOID;

    // Cargando true
    this.sweetAlertService.sweetLoading();

    this.encryptService.generateRouteGetParams( environment.apiUrl + environment.versionApiDefault + 'user/update', data.dataForm, this.authorization).then((res) => {
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
                       /**
                       * Emit individual reportando el menú para el usuario
                       */
                      this.socketioService.socketEmit( environment.socketMenu, { to: this.responseServiceDecrypt.dataMenu.idUsers[0], dataUser: this.responseServiceDecrypt.data, dataMenu: this.responseServiceDecrypt.dataMenu });
                      /**
                       * Fin emit individual reportando el menú para el usuario
                       */

                      /**
                       * Actualiza el localstorage para los listados
                       */
                      this.dataListModuleName = localStorage.getItem(environment.hashDataListModule);
                      this.dataListModuleNameNoAES = this.restService.decryptAES(this.dataListModuleName, this.authorization);

                      if (this.dataListModuleNameNoAES == this.responseServiceDecrypt.dataModule) {
                        localStorage.removeItem( environment.hashDataList );
                        this.restService.decryptAES(this.responseServiceDecrypt.dataListUser, this.authorization);
                      }
                      /**
                       * Fin actualiza el localstorage para los listados
                       */
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
