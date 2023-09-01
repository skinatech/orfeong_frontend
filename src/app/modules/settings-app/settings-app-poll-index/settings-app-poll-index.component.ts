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
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FloatingButtonService } from 'src/app/services/floating-button.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { GlobalAppService } from '../../../services/global-app.service';
import { RestService } from '../../../services/rest.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { ChangeChildrenService } from '../../../services/change-children.service';


@Component({
  selector: 'app-settings-app-poll-index',
  templateUrl: './settings-app-poll-index.component.html',
  styleUrls: ['./settings-app-poll-index.component.css']
})
export class SettingsAppPollIndexComponent implements OnInit {

  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderIcon = 'rule';
  initCardHeaderTitle = 'Listado de encuestas';
  // Nombre del módulo donde se esta accediendo al initialList
  route: string = 'Polls';
  // Autorizacion de localstorage
  authorization: string;
  // Version api
  versionApi = environment.versionApiDefault;
  // Ruta a redirigir
  redirectionPath = '/setting/poll-index';
  /** Formulario index */
  initBotonCreateRoute: string = '/setting/poll-create'; // Ruta del botón crear
  initBotonUpdateRoute: string = '/setting/poll-update'; // Ruta editar
  initBotonViewRoute: string = '/setting/poll-view'; // Ruta ver
  initBtnVersioningIndexteRoute: string = this.redirectionPath; // Ruta Index de versionamiento
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Configuración', 'route': '/setting' },
  ];
  breadcrumbRouteActive = 'Encuesta de satisfacción';
  // Configuraciones para datatables
  routeLoadDataTablesService: string = environment.versionApiDefault + 'configuracionApp/encuestas/index';
  // Configuración para el proceso change status
  routeChangeStatus: string = environment.versionApiDefault + 'configuracionApp/encuestas/change-status';

  dtTitles: any = [
    { 'title': 'Nombre encuesta', 'data': 'nombreCgEncuesta' },
    { 'title': 'Número preguntas', 'data': 'numeroPreguntas' },
    { 'title': 'Fecha creación', 'data': 'creacionCgEncuesta' },
  ];
  /** Fin Configuraciones para datatables */
  /** Fin Initial List */

  /**
   * Configuración para el botón flotante
   */
  menuButtonsSelectNull: any = [
    { icon: 'add', title: 'Agregar', action: 'add', data: '' },
  ];
  menuButtonsSelectOne: any = [
    { icon: 'add', title: 'Agregar', action: 'add', data: '' },
    { icon: 'edit', title: 'Editar', action: 'edit', data: '' },
    { icon: 'remove_red_eye', title: 'Ver', action: 'view', data: '' },
    { icon: 'autorenew', title: 'Cambiar estado', action: 'changeStatus', data: '' },
  ];
  menuButtonsSelectMasive: any = [
    { icon: 'add', title: 'Agregar', action: 'add', data: '' },
  ];

  /** Variable que controla botón flotante */
  menuButtons: any = this.menuButtonsSelectNull;
  eventClickButtonSelectedData: any;

  resSerFormSubmit: any;
  resSerFormSubmitErr: any;

  constructor( 
    private router: Router, private floatingButtonService: FloatingButtonService, 
    public globalAppService: GlobalAppService, public sweetAlertService: SweetAlertService, 
    public restService: RestService, public lhs: LocalStorageService, private changeChildrenService: ChangeChildrenService
  )  { }

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

  /**
   *
   * @param event
   * Procesando las opciones del menu flotante
   */
  menuReceiveData(event) {

    switch (event.action) {
      case 'add':
        this.router.navigate(['/' + this.initBotonCreateRoute]);
      break;
      case 'edit':
        this.router.navigate(['/' + this.initBotonUpdateRoute + '/' + this.eventClickButtonSelectedData[0]['data'][0]]);
      break;
      case 'view':
        this.router.navigate(['/' + this.initBotonViewRoute + '/' + this.eventClickButtonSelectedData[0]['data'][0]]);
      break;
      case 'changeStatus':
        this.loadIdsReiveData().then((res) => {
          this.changeStatus(res);
        });
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

  loadIdsReiveData() {
    return new Promise<any>((resolve) => {
      let idsChangeStatus = [];
      this.eventClickButtonSelectedData.forEach(data => {
        idsChangeStatus.push(data.id + '|' + data.idInitialList);
      });
      resolve(idsChangeStatus);
    });
  }

  changeStatus(data) {

    // Cargando true
    this.sweetAlertService.sweetLoading();

    this.restService.restPut( this.routeChangeStatus, data, this.authorization)
      .subscribe((res) => {
        this.resSerFormSubmit = res;

        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerFormSubmit, false).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            // Muestra el mensaje
            this.sweetAlertService.showNotification('success', this.resSerFormSubmit.message);
            // Recargar Initial List
            this.changeChildrenService.changeProcess({ proccess: "reload" });
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
