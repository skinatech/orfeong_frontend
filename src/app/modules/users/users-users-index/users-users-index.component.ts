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
import { Router,ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FloatingButtonService } from 'src/app/services/floating-button.service';
import { EncryptService } from 'src/app/services/encrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ConvertParamsBase64Helper } from 'src/app/helpers/convert-params-base64.helper';
import { RestService } from 'src/app/services/rest.service';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-users-users-index',
  templateUrl: './users-users-index.component.html',
  styleUrls: ['./users-users-index.component.css']
})
export class UsersUsersIndexComponent implements OnInit {

  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderIcon = 'person';
  initCardHeaderTitle = 'Listado de usuarios';
  redirectionPath: string = '/users/users-index/false';
  route: string = 'Users'; // Nombre del módulo donde se esta accediendo al initialList
  /** Formulario index */
  initBotonCreateText: string = 'Crear'; // Texto del botón crear
  initBotonCreateRoute: string = '/users/users-create'; // Ruta del botón crear
  initBotonUpdateRoute: string = '/users/users-update'; // Ruta editar usuario
  initBotonViewRoute: string = '/users/users-view'; // Ruta ver usuario
  initBotonMassiveRoute: string = '/users/users-massive'; // Ruta ver usuario
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Gestión de usuarios', 'route': '/users' }
  ];
  breadcrumbRouteActive = 'Administrar usuarios';

  /** Configuraciones para datatables */
  routeLoadDataTablesService: string = environment.versionApiDefault + 'user/index';
  dtTitles: any = [
    { 'title': 'Nombres', 'data': 'nombreUserDetalles' },
    { 'title': 'Apellidos', 'data': 'apellidoUserDetalles' },
    { 'title': 'Documento', 'data': 'documento' },
    { 'title': 'Cargo', 'data': 'cargoUserDetalles' },
    { 'title': 'Correo electrónico', 'data': 'email' },
    { 'title': 'Dependencia', 'data': 'dependencia' },
    { 'title': 'Rol', 'data': 'rol' },
  ];
  // Mensaje que se muestra en la alerta que se muestra cuando el status no se puede inactivar
  menssageStatus: string = 'El usuario tiene radicados asignados y no se puede inactivar';
  /** Fin Configuraciones para datatables */
  /** Fin Initial List */

  /**
   * Configuración para el botón flotante
   */
  menuButtonsSelectNull: any = [
    { icon: 'add', title: 'Agregar', action: 'add', data: '' },
    { icon: 'library_books', title: 'Proceso masivo', action: 'massive', data: '' },
  ];
  menuButtonsSelectOne: any = [
    { icon: 'add', title: 'Agregar', action: 'add', data: '' },
    { icon: 'edit', title: 'Editar', action: 'edit', data: '' },
    { icon: 'remove_red_eye', title: 'Ver', action: 'view', data: '' },
    { icon: 'autorenew', title: 'Cambiar estado', action: 'changeStatus', data: '' },
  ];
  menuButtonsSelectMasive: any = [
    { icon: 'add', title: 'Agregar', action: 'add', data: '' },
    { icon: 'autorenew', title: 'Cambiar estado', action: 'changeStatus', data: '' }
  ];

  /** Variable que controla botón flotante */
  menuButtons: any = this.menuButtonsSelectNull;
  eventClickButtonSelectedData: any;
  // Autorizacion de localstorage
  authorization: string = '';
  statusInital: boolean = false; // se oculta hasta que entre al tocken

  // Version api
  versionApi = environment.versionApiDefault;

  /** Datos para el proceso correspondiente a orfeoNg express*/
  orfeoNgExpressVal = environment.orfeoNgExpress;
  resServicesorfeoNgExpressVal: any;
  resServicesorfeoNgExpressValErr: any;
  dataDevueltaExpress: any;
  /** Fin orfeoNg express*/

  /**
   * Configuración para el proceso change status
   */
  routeChangeStatus: string = environment.versionApiDefault + 'user/change-status';
  /**
   * Valida si el filtro debe mostrarse automaticamente
   */
  paramFilterActive: any; // mostrar modal filtros automaticamente
  params: any; // data que llega por get para los filtros
  paramsOk: any; // data que llega por get para los filtros
  dataFilter: any; // Data para filtros

  constructor(private router: Router, private floatingButtonService: FloatingButtonService, private routeActi: ActivatedRoute, private encryptService: EncryptService, private lhs: LocalStorageService, public restService: RestService, public globalAppService: GlobalAppService, public sweetAlertService: SweetAlertService) {
    // Recoge el parametro para mostrar el modal 
    this.params = this.routeActi.snapshot.paramMap.get('params');
    // Verifica que si llega false o open se vata a activar el modal
    if ( this.params != 'false' && this.params != 'open' ){
      this.params = ConvertParamsBase64Helper(this.params); // Se pasa al html como componete para que reciba el ID
    }else{
      // mostrar modal filtros automaticamente cuando llega open
      this.paramFilterActive = this.params;
    }
  }

  ngOnInit() {
    this.getTokenLS();
  }

  /** Método para obtener el token que se encuentra encriptado en el local storage */
  getTokenLS() {
    /** Se consulta solo si el token no se recibió como Input() */
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
      this.paramsOk = this.encryptService.decryptAES(this.params, this.authorization );
      // Verifica si muestra o no los filtros
      if ( this.params !== false && this.params != 'open' ) {
        // Verifica si tiene información en params encryptada
        if ( this.paramsOk['__zone_symbol__value'] ) {
          // Asigna la estructura para que se filtre igual que en backend
          let filterOperation = [];
          filterOperation.push(this.paramsOk['__zone_symbol__value']);
          let dataok = { filterOperation: filterOperation };
          this.dataFilter = { status: true, data: dataok };
        }
      }
      // Muestra el initial list hasta que tenga confirmado si llegan parametros
      this.statusInital = true;
    });
  }

  /**
   *
   * @param event
   * Procesando las opciones del menu flotante
   */
  menuReceiveData(event) {
    switch (event.action) {
      case 'add':
        
        // Si la cantidad de registros mostrados es igual a la cantidad de los enviroments y el orfeoNG expres
        if (this.orfeoNgExpressVal.ocultarModulos == true) {
          // se llama al metodo que ejecuta mensaje de comercial
          this.messageExpress();
          this.router.navigate(['/' + this.redirectionPath]);
        }else{
          this.router.navigate(['/' + this.initBotonCreateRoute]);
        }
        
      break;
      case 'edit':
        this.router.navigate(['/' + this.initBotonUpdateRoute + '/' + this.eventClickButtonSelectedData[0]['data'][0]]);
      break;
      case 'view':
        this.router.navigate(['/' + this.initBotonViewRoute + '/' + this.eventClickButtonSelectedData[0]['data'][0]]);
      break;
      case 'changeStatus':
        this.floatingButtonService.changeStatus(this.eventClickButtonSelectedData);
      break;
      case 'massive':
        this.router.navigate(['/' + this.initBotonMassiveRoute]);
      break;
    }
  }

  /**
   *
   * @param event
   * Recibe la data de los registros a lo que se les hizo clic
   */
  selectedRowsReceiveData(event) {
    if (event.length > 0) {
      if (event.length == 1) { // Un registro seleccionado
        this.eventClickButtonSelectedData = event;
        this.menuButtons = this.menuButtonsSelectOne;
      } else { // Varios registros seleccionados
        this.menuButtons = this.menuButtonsSelectMasive;
      }
    } else { // Ningun registro seleccionado
      this.menuButtons = this.menuButtonsSelectNull;
    }
  }

  /** Mendiante esta opción se llama al servicio que muestra el mensaje de comercial para adquirir OrfeoNg completo */
  messageExpress(){

    /** Cantidad de registros a mostrar en el listado incial, limitante que se envia al bakend */
    let params = {
      data: this.orfeoNgExpressVal.limitarCreacionUsuarios
    };

    this.restService.restPost(this.versionApi + 'user/comercial', params, this.authorization).subscribe((res) => {
      this.resServicesorfeoNgExpressVal = res;

      if(this.resServicesorfeoNgExpressVal.status == 200){
        this.router.navigate(['/' + this.initBotonCreateRoute]);
      }

      this.globalAppService.resolveResponse(this.resServicesorfeoNgExpressVal, false).then((res) => {
        const responseResolveResponse = res;
      });

    }, (err) => {
      this.resServicesorfeoNgExpressValErr = err;
      // Evaluar respuesta de error del servicio
      this.globalAppService.resolveResponseError(this.resServicesorfeoNgExpressValErr).then((res) => { });
    }
    );

  }

}
