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
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FloatingButtonService } from 'src/app/services/floating-button.service';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { EncryptService } from 'src/app/services/encrypt.service';
import { ConvertParamsBase64Helper } from 'src/app/helpers/convert-params-base64.helper';

@Component({
  selector: 'app-arc-manag-docu-transfer-index',
  templateUrl: './arc-manag-docu-transfer-index.component.html',
  styleUrls: ['./arc-manag-docu-transfer-index.component.css']
})
export class ArcManagDocuTransferIndexComponent implements OnInit {

  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderIcon = 'backup_table';
  initCardHeaderTitle = 'Listado de expedientes';
  // Nombre del módulo donde se esta accediendo al initialList
  route: string = 'DocumentaryTransfer';
  // Autorizacion de localstorage
  authorization: string;
  // Version api
  versionApi = environment.versionApiDefault;
  // Ruta a redirigir
  redirectionPath = '/archiveManagement/archive-filing-index';
  /** Formulario index */
  initBotonCreateRoute: string = ''; // Ruta del botón crear
  initBotonUpdateRoute: string = ''; // Ruta editar
  initBotonViewRoute: string = '/archiveManagement/archive-location'; // Ruta ver
  initBtnVersioningIndexteRoute: string = this.redirectionPath; // Ruta Index de versionamiento
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Gestión de archivo', 'route': '/archiveManagement' },
  ];
  breadcrumbRouteActive = 'Transferencias documentales';
  statusButtonIndex = true; // muestra el boton del index
  // Configuraciones para datatables
  routeLoadDataTablesService: string = environment.versionApiDefault + 'gestionDocumental/trd-transferencia/index';
  // Configuración para el proceso change status
  routeChangeStatus: string = '';
  dtTitles: any = [
    { 'title': 'Expediente', 'data': 'nombreExpediente' },
    { 'title': 'Número expediente', 'data': 'numeroExpediente' },
    { 'title': 'Serie', 'data': 'serie' },
    { 'title': 'Subserie', 'data': 'subserie' },
    { 'title': 'Fecha proceso', 'data': 'fechaProceso' },
    { 'title': 'Dependencia', 'data': 'dependenciaCreador' },
    { 'title': 'Usuario', 'data': 'userCreador' },
    { 'title': 'Tipo de archivo', 'data': 'tipoArchivo' },
  ];
  /** Fin Configuraciones para datatables */
  /** Fin Initial List */

  /**
   * Configuración para el botón flotante
   */
  menuButtonsSelectNull: any = [];
  menuButtonsSelectOne: any = [
    { icon: 'check_circle_outline', title: 'Aceptar transferencia', action: 'acceptTransfer', data: '' },
    { icon: 'cancel', title: 'Rechazar transferencia', action: 'rejectTransfer', data: '' },
    { icon: 'loyalty', title: 'Descargar FUID', action: 'downloadFuid', data: '' },
  ];
  menuButtonsSelectTransfe: any = [
    { icon: 'next_plan', title: 'Transferencia manual', action: 'manualTransfer', data: '' },
  ];
  menuButtonsSelectArchived: any = [
    { icon: 'batch_prediction', title: 'Archivar', action: 'archiveFolder', data: '' },
  ];
  menuButtonsSelectDesc: any = [
    { icon: 'loyalty', title: 'Descargar FUID', action: 'downloadFuid', data: '' },
  ];
  menuButtonsSelectMasive: any = [];

  /** Variable que controla botón flotante */
  menuButtons: any = this.menuButtonsSelectNull;
  eventClickButtonSelectedData: any;
  hashLocalStorage: any;
  // Variables del modal
  statusModalMain: boolean = false; // Muestra el modal
  textFormObservaHeader: string; // Titulo del modal
  operationDialogObserva: string; // operación seleccionada
  // Variables de modal archivo
  statusArchiveModal = false; // Muestra el modal de archivar
  textFormHeader: string; // Titulo del modal
  statusButton: boolean = true; // Muestra el boton principal

  params: any; // data que llega por get para los filtros
  paramsOk: any; // data que llega por get para los filtros
  dataFilter: any; // Data para filtros

  statusInital: boolean = false;

  constructor( private router: Router, private floatingButtonService: FloatingButtonService, private authService: AuthService, private lhs: LocalStorageService, private encryptService: EncryptService, private routeActi: ActivatedRoute)  {
    // Recoge el parametro para mostrar el modal 
    this.params = this.routeActi.snapshot.paramMap.get('params');
    // Verifica que si llega false o open se vata a activar el modal
    if ( this.params != 'false' && this.params != 'open' && this.params != '' && this.params != null){
      this.params = ConvertParamsBase64Helper(this.params);
    }
  }

  ngOnInit() {
    this.hashLocalStorage = this.authService.decryptAES( localStorage.getItem( environment.hashSkina ) );
    this.getTokenLS();
  }

  /** Método para obtener el token que se encuentra encriptado en el local storage */
  getTokenLS() {
    /** Se consulta solo si el token no se recibió como Input() */
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
      this.paramsOk = this.encryptService.decryptAES(this.params, this.authorization );
      // Verifica si muestra o no los filtros
      if ( this.params !== false && this.params != 'open' && this.params != '' && this.params != null) {
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
    // Asigna la operacion en una variable
    this.operationDialogObserva = event.action;
    // Valida la operacion
    switch (event.action) {
      case 'acceptTransfer':
        this.floatingButtonService.changeAcceptTransfer(this.eventClickButtonSelectedData);
      break;
      case 'rejectTransfer':
          this.statusModalMain = true;
          this.textFormObservaHeader = event.title; // Titulo del modal
      break;
      case 'archiveFolder':
        this.statusButton = false; // Oculta los botones principales
        this.statusArchiveModal = true; // Muestra el modal de archivo
        this.textFormHeader = event.title; // Titulo del modal
      break;
      case 'manualTransfer':
        this.statusModalMain = true;
        this.textFormObservaHeader = event.title; // Titulo del modal
      break;
      case 'downloadFuid':
          this.floatingButtonService.changeDownloadFuit(this.eventClickButtonSelectedData);
      break;
    }
  }

  /** Cerrar o desdruir componente observaciones */
  closeObserva(dataObserva) {

    // Inicio - Se reestablecen los valores que se muestran en el componente de observaciones
    this.statusModalMain = false; // oculta el modal
    this.statusArchiveModal = false; // oculta el modal archivo
    this.statusButton = true; // Muestra el boton principal
    // Fin reestablecer variables
    // dataObserva es la data que retorna el componente de observaciones
    if ( dataObserva.status ) {
      switch ( this.operationDialogObserva ) {
        case 'manualTransfer':
          this.floatingButtonService.changeManualTransfer(this.eventClickButtonSelectedData, dataObserva.data);
        break;
        case 'rejectTransfer':
          this.floatingButtonService.changeRejectTransfer(this.eventClickButtonSelectedData, dataObserva.data);
        break;
        case 'archiveFolder':
          this.floatingButtonService.changeArchiveFolder(this.eventClickButtonSelectedData, dataObserva.data);
        break;
      }

    }

  }

  /**
   *
   * @param event
   * Recibe la data de los registros a lo que se les hizo clic
   */
  selectedRowsReceiveData(event) {

    if (event.length > 0) {
      this.validaButtons(event);
      if (event.length == 1) { // Un registro seleccionado
        this.eventClickButtonSelectedData = event;
        // this.menuButtons = this.menuButtonsSelectOne;
      } else { // Varios registros seleccionados
        event.forEach( data => {
          // this.menuButtons = this.menuButtonsSelectMasive;
        });
      }
    } else { // Ningun registro seleccionado
      this.menuButtons = this.menuButtonsSelectNull;
    }
  }

  /**
   * funcion que muestra los botones dependiendo los estados de los registros seleccionados
   */
  validaButtons(event) {

    let statusMismoTipo: boolean = true;
    let valUnico = event[0].status;
    let statusMismoCreador: boolean = true;
    let valUnicoCreador = event[0].idUserCreador;

    this.eventClickButtonSelectedData = event;
    if (event.length == 1) { // Un registro seleccionado
      if (event[0].idUserCreador == this.hashLocalStorage.data.idDataCliente && event[0].status == 10 ) {
        this.menuButtons = this.menuButtonsSelectTransfe;
      }
    } else { // Varios registros seleccionados
      event.forEach( data => {
        if ( valUnico != data.status ) {
          statusMismoTipo = false;
        }
        if ( valUnicoCreador != data.idUserCreador ) {
          statusMismoCreador = false;
        }
      });
    }

    if (statusMismoTipo) {
      switch (valUnico) {
        case environment.statusExpedientesText.pendienteTransferir:
          if (statusMismoCreador) {
            this.menuButtons = this.menuButtonsSelectOne;
          } else {
            this.menuButtons = this.menuButtonsSelectNull;
          }
        break;
        case environment.statusExpedientesText.finalizado:
          if (statusMismoCreador) {
            this.menuButtons = this.menuButtonsSelectDesc;
          } else {
            this.menuButtons = this.menuButtonsSelectNull;
          }
        break;
        case environment.statusExpedientesText.transferenciaAceptada:
          if (statusMismoCreador) {
            this.menuButtons = this.menuButtonsSelectArchived;
          } else {
            this.menuButtons = this.menuButtonsSelectNull;
          }
        break;
        case environment.statusExpedientesText.transferenciaRechazada:
          this.menuButtons = this.menuButtonsSelectTransfe;
        break;
      }

    } else {
      this.menuButtons = this.menuButtonsSelectNull;
    }

  }

}
