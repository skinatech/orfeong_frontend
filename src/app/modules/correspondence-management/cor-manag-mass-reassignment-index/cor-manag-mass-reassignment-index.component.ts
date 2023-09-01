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
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RestService } from 'src/app/services/rest.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { FloatingButtonService } from 'src/app/services/floating-button.service';

@Component({
  selector: 'app-cor-manag-mass-reassignment-index',
  templateUrl: './cor-manag-mass-reassignment-index.component.html',
  styleUrls: ['./cor-manag-mass-reassignment-index.component.css']
})
export class CorManagMassReassignmentIndexComponent implements OnInit {

  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderIcon = 'library_add_check';
  initCardHeaderTitle = 'Listado de radicados';
  route: string = 'correspondenceManagement'; // Nombre del módulo donde se esta accediendo al initialList
  // Ruta a redirigir
  redirectionPath = '/correspondenceManagement/mass-reassignment-index';
  /** Formulario index */
  initBotonCreateRoute: string = '/filing/filing-create'; // Ruta del botón crear
  initBotonUpdateRoute: string = '/filing/filing-update'; // Ruta editar
  initBotonViewRoute: string = '/filing/filing-view'; // Ruta ver
  /**
   * Configuración para el proceso change status de anulacion
   */
  routeChangeStatus: string;

  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Gestión correspondencia', 'route': '/correspondenceManagement' },
  ];
  breadcrumbRouteActive = 'Reasignación masiva';

  // Configuraciones para datatables
  routeLoadDataTablesService: string = environment.versionApiDefault + 'radicacion/reasignacion-radicado/index';

  dtTitles: any = [
    { 'title': 'Tipo radicado', 'data': 'TipoRadicado' },
    { 'title': 'Número radicado', 'data': 'numeroRadiRadicado' },
    { 'title': 'Fecha creación', 'data': 'creacionRadiRadicado' },
    { 'title': 'Cliente', 'data': 'nombreCliente' },
    { 'title': 'Asunto', 'data': 'asuntoRadiRadicado' },
    { 'title': 'Tipo documental', 'data': 'nombreTipoDocumental' },
    { 'title': 'Fecha vencimiento', 'data': 'fechaVencimientoRadiRadicados' },
    { 'title': 'Usuario tramitador', 'data': 'usuarioTramitador' },
  ];
  /** Fin Configuraciones para datatables */
  /** Fin Initial List */

  /**
   * Configuración para el botón flotante
   */
  menuButtonsSelectNull: any = [];
  menuButtonsSelectOne: any = [
    { icon: 'send', title: 'Reasignar', action: 'send', data: ''}

  ];
  menuButtonsSelectMasive: any = [
    { icon: 'send', title: 'Reasignar', action: 'send', data: ''}
  ];

  /** Variable que controla botón flotante */
  menuButtons: any = this.menuButtonsSelectNull;
  eventClickButtonSelectedData: any;
  // Version api
  versionApi = environment.versionApiDefault;
  // Autorizacion de localstorage
  authorization: string;

  // Variables para dialogo de observaciones
  statusModalMain: boolean = false;  // Muestra el componente de anexos main
  showAgenda: boolean = false;  // Muestra el input de fecha
  showReasignacion: boolean = false;  // Muestra los inputs de reasignacion
  textFormObservaHeader: string; // Titulo del botón inteligente tambien titulo del dialog observacion
  // Data a enviar de los usuariosal componente de observaciones
  dataObserva: any = [];
  dataUserTramitador: any = [];

  /** Variables respuesta Servicios */
  resServices: any;
  resErrServices: any;

  constructor(private router: Router, public restService: RestService, public sweetAlertService: SweetAlertService, public lhs: LocalStorageService, public globalAppService: GlobalAppService,
    private floatingButtonService: FloatingButtonService ) { }

  ngOnInit() {
    // Hace el llamado del token
    this.getTokenLS();
  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
    });
  }

  /**
   * @param event
   * Procesando las opciones del menu flotante
   */
  menuReceiveData(event) {

    // Agrega los id's de los radicados para tratarlos
    let selecRadi = this.eventClickButtonSelectedData;

    if ( selecRadi ) {
      selecRadi.forEach(element => {
        if ( this.dataUserTramitador.indexOf(element.usuarioTramitador) < 0 ) {
          this.dataUserTramitador.push(element.usuarioTramitador);
        }
      });
    }

    switch (event.action) {
      case 'add':
        this.router.navigate(['/' + this.initBotonCreateRoute]);
      break;
      case 'send':
        // Usuarios que tramitan los radicados
        let userTrami = {
          userOrigen: this.dataUserTramitador
        };
        this.dataObserva = userTrami;
        this.showAgenda = false;
        this.showReasignacion = true;
        this.routeChangeStatus = this.versionApi + 'radicacion/transacciones/re-asign';
        this.textFormObservaHeader = event.title;
        this.statusModalMain = true;
      break;
    }
  }

  /** Cerrar o desdruir componente observaciones */
  closeObserva(dataObserva) {

    // dataObserva es la data que retorna el componente de observaciones
    if ( dataObserva.status ) {
      // this.transactionReasing(dataObserva);
      this.floatingButtonService.changeTransactionReasign(this.eventClickButtonSelectedData, dataObserva.data, 'massReasign' );
    }
    this.statusModalMain = false;

  }

  transactionReasing(dataObserva) {

    let params = {
      data: dataObserva.data,
      ButtonSelectedData: this.eventClickButtonSelectedData
    };

    // loading true
    this.sweetAlertService.sweetLoading();

    this.restService.restPost(this.versionApi + 'radicacion/transacciones/re-asign', params, this.authorization).subscribe((res) => {

        this.resServices = res;

        this.globalAppService.resolveResponse(this.resServices, false).then((res) => {
          const responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.sweetAlertService.showNotification( 'success', this.resServices['message'] );
          }
          // Cargando false
          this.sweetAlertService.sweetClose();
        });

        }, (err) => {
          this.resErrServices = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resErrServices).then((res) => { });
        }
    );

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

}
