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
import { FloatingButtonService } from 'src/app/services/floating-button.service';
import { typeViewHistoryLoans } from '../resources/enums/history-loans.enum';

@Component({
  selector: 'app-doc-loans-manage-loan-index',
  templateUrl: './doc-loans-manage-loan-index.component.html',
  styleUrls: ['./doc-loans-manage-loan-index.component.css']
})
export class DocLoansManageLoanIndexComponent implements OnInit {

  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderIcon = 'preview';
  initCardHeaderTitle = 'Listado de radicados';
  // Nombre del módulo donde se esta accediendo al initialList
  route: string = 'ManageLoan';
  // Autorizacion de localstorage
  authorization: string;
  // Version api
  versionApi = environment.versionApiDefault;
  // Ruta a redirigir
  redirectionPath = '/documentaryLoans/manage-loan-index';
  /** Formulario index */
  initBotonCreateRoute: string = ''; // Ruta del botón crear
  initBotonUpdateRoute: string = ''; // Ruta editar
  initBotonViewRoute: string = '/documentaryLoans/history-loan'; // Ruta ver
  initBtnVersioningIndexteRoute: string = this.redirectionPath; // Ruta Index de versionamiento
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Préstamos documentales', 'route': '/documentaryLoans' },
  ];
  breadcrumbRouteActive = 'Administrar préstamo';
  // Configuraciones para datatables
  routeLoadDataTablesService: string = environment.versionApiDefault + 'gestionArchivo/prestamo-documental/index-manage-loan';

  dtTitles: any = [
    { 'title': 'Número radicado', 'data': 'filingNumber' },
    //{ 'title': 'Fecha', 'data': 'settledFinished' }, //**index administracion de préstamo** quitar la segunda columna "fecha"
    { 'title': 'Asunto', 'data': 'subject' },
    { 'title': 'Tipo documental', 'data': 'documentaryType' },
    { 'title': 'Expediente', 'data': 'fileName' },
    { 'title': 'Tipo préstamo', 'data': 'loanType' },
    { 'title': 'Requerimiento', 'data': 'request' },
    { 'title': 'Fecha solicitud préstamo', 'data': 'applicationDate' },
    { 'title': 'Área de archivo', 'data': 'warehouse' },
    { 'title': 'Módulo', 'data': 'rack' },
    { 'title': 'Entrepaño', 'data': 'shelf' },
    { 'title': 'Caja', 'data': 'box' },
    { 'title': 'Usuario', 'data': 'user' },
    { 'title': 'Dependencia', 'data': 'dependency' },
  ];
  /** Fin Configuraciones para datatables */
  /** Fin Initial List */

  /**
   * Configuración para el botón flotante
   */
  menuButtonsSelectNull: any = [];
  menuButtonsSelectOne: any = [
    { icon: 'check_circle_outline', title: 'Aprobar solicitud', action: 'approveLoan', data: '' },
    { icon: 'cancel', title: 'Rechazar solicitud', action: 'cancelLoan', data: '' },
    { icon: 'receipt_long', title: 'Historial', action: 'history', data: '' },
  ];
  menuButtonsSelectMasive: any = [
    { icon: 'check_circle_outline', title: 'Aprobar solicitud', action: 'approveLoan', data: '' },
    { icon: 'cancel', title: 'Rechazar solicitud', action: 'cancelLoan', data: '' },
  ];

  menuButtonsSelectDevolver: any = [
    { icon: 'reply', title: 'Devolver', action: 'returnLoan', data: '' },
    { icon: 'receipt_long', title: 'Historial', action: 'history', data: '' },
  ];

  menuButtonsSelectMasiveDev: any = [
    { icon: 'reply', title: 'Devolver', action: 'returnLoan', data: '' },
  ];

  menuButtonsSelectHistory: any = [
    { icon: 'receipt_long', title: 'Historial', action: 'history', data: '' },
  ];

  menuButtonsSelectAutorizar = [
    { icon: 'task', title: 'Autorizar préstamo', action: 'authorizeLoan', data: '' },
    { icon: 'receipt_long', title: 'Historial', action: 'history', data: '' }
  ];

  menuButtonsSelectAutorizado: any = [
    { icon: 'check_circle_outline', title: 'Aprobar solicitud', action: 'approveLoan', data: '' },
    { icon: 'cancel', title: 'Rechazar solicitud', action: 'cancelLoan', data: '' },
    { icon: 'receipt_long', title: 'Historial', action: 'history', data: '' },
  ];

  /** Variable que controla botón flotante */
  menuButtons: any = this.menuButtonsSelectNull;
  eventClickButtonSelectedData: any;

  /** Modal observation */
  statusModalMain: boolean = false;
  textFormObservaHeader: string = '';
  showPass: boolean = true; // acepta préstamo
  showCancelPrestamo: boolean = false; // Cancela préstamo
  prestamoFisico: boolean = false; // el préstamo es físico
  operationDialogObserva: string; // Menu seleccionado

  titleFecha = 'Fecha devolución';
  // Rutas para las funcionalidades del botón flotante
  routeProcessAprove = `${environment.versionApiDefault}gestionArchivo/prestamo-documental/approve-loan`;
  routeProcessCancel = `${environment.versionApiDefault}gestionArchivo/prestamo-documental/cancel-loan`;
  routeProcessReturn = `${environment.versionApiDefault}gestionArchivo/prestamo-documental/return-loan`;
  routeProcessAproveAuthorize = `${environment.versionApiDefault}gestionArchivo/prestamo-documental/authorize-loan`;

  constructor( private router: Router, private floatingButtonService: FloatingButtonService)  { }

  ngOnInit() {
  }

  /**
   *
   * @param event
   * Procesando las opciones del menu flotante
   */
  menuReceiveData(event) {
    // Asigna el valor para utilizar lo en otras funciones
    this.operationDialogObserva = event.action;
    switch (event.action) {
      case 'approveLoan':
        this.statusModalMain = true; // Muestra el modal
        this.textFormObservaHeader = event.title; // Asigna el titulo a mostrar
      break;
      case 'cancelLoan':
        this.statusModalMain = true; // Muestra el modal
        this.prestamoFisico = false; // Oculta el campo fecha
        this.showPass = false; // Oculta el campo password
        this.textFormObservaHeader = event.title; // Asigna el titulo a mostrar
      break;
      case 'returnLoan':
          this.statusModalMain = true; // Muestra el modal
          this.textFormObservaHeader = event.title; // Asigna el titulo a mostrar
      break;
      case 'history':
        this.router.navigate([`/${this.initBotonViewRoute}/${this.eventClickButtonSelectedData[0]['data'][0]}/${typeViewHistoryLoans.HISTORY_LOAN}`]);
      break;
      case 'authorizeLoan':
        this.statusModalMain = true; // Muestra el modal
        this.prestamoFisico = false; // Oculta el campo fecha
        this.showPass = false; // Oculta el campo password
        this.textFormObservaHeader = event.title; // Asigna el titulo a mostrar
      break;
    }
  }

  /** Cerrar o desdruir componente observaciones */
  closeObserva(dataObserva) {

    // Inicio - Se reestablecen los valores que se muestran en el componente de observaciones
    this.statusModalMain = false; // oculta el modal

    // dataObserva es la data que retorna el componente de observaciones
    if ( dataObserva.status ) {
      this.showPass = true; // reestablecer variables
      this.prestamoFisico = false; // reestablecer variables

      switch ( this.operationDialogObserva ) {
        case 'approveLoan':
          this.floatingButtonService.changeApproveLoan(this.eventClickButtonSelectedData, dataObserva.data, this.routeProcessAprove);
        break;
        case 'cancelLoan':
          this.floatingButtonService.changeCancelLoan(this.eventClickButtonSelectedData, dataObserva.data, this.routeProcessCancel);
        break;
        case 'returnLoan':
          this.floatingButtonService.changeReturnLoan(this.eventClickButtonSelectedData, dataObserva.data, this.routeProcessReturn);
        break;
        case 'authorizeLoan':
          this.floatingButtonService.changeApproveLoan(this.eventClickButtonSelectedData, dataObserva.data, this.routeProcessAproveAuthorize);
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
      if (event.length == 1) { // Un registro seleccionado
        this.eventClickButtonSelectedData = event;
        this.validaButtons(event);
      } else { // Varios registros seleccionados
        this.eventClickButtonSelectedData = event;
        this.validaButtons(event);
      }

    } else { // Ningun registro seleccionado
      this.menuButtons = this.menuButtonsSelectNull;
    }
  }

  /**
   * Funcion que permite validar los estados de lo seleccionado en el initial list
   * @param event
   */
  validaButtons(event) {
    this.prestamoFisico = false;
    let statusMismoTipo: boolean = true;
    let statusPrestamo = event[0].status;
    let valUnico = event[0].idLoanType;
    let massiveRecords: boolean = false;
    this.showPass = true;

    if (event.length == 1) { // Un registro seleccionado
      // Valida préstamo físico
      if ( statusPrestamo == environment.statusLoanNumber.solicitudPrestamo && valUnico == environment.statusLoanTypeText.prestamoFisico ) {
        this.prestamoFisico = true;
      }
      if ( valUnico == environment.statusLoanTypeText.prestamoDigital ) {
        this.showPass = false;
      }

    } else { // Varios registros seleccionados
      massiveRecords = true;
      // Inicio Valida préstamo físico
      if ( statusPrestamo == environment.statusLoanNumber.solicitudPrestamo && valUnico == environment.statusLoanTypeText.prestamoFisico ) {
        this.prestamoFisico = true;
      }
      event.forEach(element => {
        if ( statusPrestamo != element.status ) {
          statusMismoTipo = false;
        }
        // Valida préstamo físico
        if ( element.status == environment.statusLoanNumber.solicitudPrestamo && element.idLoanType != environment.statusLoanTypeText.prestamoFisico ) {
          this.prestamoFisico = false;
        }
      });
    }

    if (statusMismoTipo) {
      switch ( statusPrestamo ) {
        case environment.statusLoanNumber.solicitudPrestamo:
            if (this.prestamoFisico) {
              if ( !massiveRecords ) {
                this.menuButtons = this.menuButtonsSelectOne;
              } else {
                this.menuButtons = this.menuButtonsSelectMasive;
              }
              if ( valUnico == environment.statusLoanTypeText.prestamoDigital ) {
                this.showPass = false;
              }
            } else {
              if ( valUnico == environment.statusLoanTypeText.prestamoFisico ) {
                if ( !massiveRecords ) {
                  this.menuButtons = this.menuButtonsSelectOne;
                } else {
                  this.menuButtons = this.menuButtonsSelectMasive;
                }
                event.forEach(element => {
                  // Valida préstamo físico
                  if ( element.idLoanType != environment.statusLoanTypeText.prestamoFisico ) {
                    this.menuButtons = this.menuButtonsSelectNull;
                  }
                });
              } else {
                if ( !massiveRecords ) {
                  this.menuButtons = this.menuButtonsSelectOne;
                } else {
                  this.menuButtons = this.menuButtonsSelectMasive;
                }
                event.forEach(element => {
                  // Valida préstamo físico
                  if ( element.idLoanType == environment.statusLoanTypeText.prestamoFisico ) {
                    this.menuButtons = this.menuButtonsSelectNull;
                  }
                  if ( valUnico == environment.statusLoanTypeText.prestamoDigital ) {
                    this.showPass = false;
                  }
                });

              }
            }
        break;
        case environment.statusLoanNumber.prestamoAprobado:
            if ( !massiveRecords ) {
              this.menuButtons = this.menuButtonsSelectDevolver;
            } else {
              this.menuButtons = this.menuButtonsSelectMasiveDev;
            }
        break;
        case environment.statusLoanNumber.prestamoDevuelto:
        case environment.statusLoanNumber.prestamoCancelado:
            this.prestamoFisico = false;
            this.menuButtons = this.menuButtonsSelectHistory;
        break;
        case environment.statusLoanNumber.prestamoPorAutorizar:
            this.prestamoFisico = false;
            if (!massiveRecords) {
              if (event[0]['idUserLoginDependency'] === event[0]['idDependencyExpediente']) {
                this.menuButtons = this.menuButtonsSelectAutorizar;
              } else {
                this.menuButtons = this.menuButtonsSelectNull;
              }
            } else {
              this.menuButtons = this.menuButtonsSelectNull;
            }
        break;
        case environment.statusLoanNumber.prestamoAutorizado:
            this.prestamoFisico = false;
            if (event[0]['permisoArchivoCentral']) {
              this.menuButtons = this.menuButtonsSelectAutorizado;
            } else {
              this.menuButtons = this.menuButtonsSelectHistory;
            }
        break;
        default:
            this.menuButtons = this.menuButtonsSelectNull;
        break;
      }
    } else {
      this.menuButtons = this.menuButtonsSelectNull;
    }

  }

}
