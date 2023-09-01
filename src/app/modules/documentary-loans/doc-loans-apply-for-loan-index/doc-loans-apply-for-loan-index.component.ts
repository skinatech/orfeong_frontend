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

@Component({
  selector: 'app-doc-loans-apply-for-loan-index',
  templateUrl: './doc-loans-apply-for-loan-index.component.html',
  styleUrls: ['./doc-loans-apply-for-loan-index.component.css']
})
export class DocLoansApplyForLoanIndexComponent implements OnInit {

  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderIcon = 'preview';
  initCardHeaderTitle = 'Listado de radicados';
  // Nombre del módulo donde se esta accediendo al initialList
  route: string = 'ApplyForLoan';
  // Autorizacion de localstorage
  authorization: string;
  // Version api
  versionApi = environment.versionApiDefault;
  // Ruta a redirigir
  redirectionPath = '/documentaryLoans/apply-for-loan-index';
  /** Formulario index */
  initBotonCreateRoute: string = ''; // Ruta del botón crear
  initBotonUpdateRoute: string = ''; // Ruta editar
  initBotonViewRoute: string = ''; // Ruta ver
  initBtnVersioningIndexteRoute: string = this.redirectionPath; // Ruta Index de versionamiento
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Préstamos documentales', 'route': '/documentaryLoans' },
  ];
  breadcrumbRouteActive = 'Solicitar préstamo';
  // Configuraciones para datatables
  routeLoadDataTablesService: string = environment.versionApiDefault + 'gestionArchivo/prestamo-documental/index';
  // Configuración para el proceso change status
  routeChangeStatus: string = environment.versionApiDefault + 'configuracionApp/cg-proveedores/change-status';

  dtTitles: any = [
    { 'title': 'Número radicado', 'data': 'filingNumber' },
    { 'title': 'Fecha', 'data': 'settledFinished' },
    { 'title': 'Asunto', 'data': 'subject' },
    { 'title': 'Tipo documental', 'data': 'documentaryType' },
    { 'title': 'Expediente', 'data': 'fileName' },
    { 'title': 'Área de archivo', 'data': 'warehouse' },
    { 'title': 'Módulo', 'data': 'rack' },
    { 'title': 'Entrepaño', 'data': 'shelf' },
    { 'title': 'Caja', 'data': 'box' },
  ];
  /** Fin Configuraciones para datatables */
  /** Fin Initial List */

  /**
   * Configuración para el botón flotante
   */
  menuButtonsSelectNull: any = [];
  menuButtonsSelectOne: any = [
    { icon: 'how_to_vote', title: 'Solicitar préstamo', action: 'ApplyForLoan', data: '' },
  ];
  menuButtonsSelectMasive: any = [
    { icon: 'how_to_vote', title: 'Solicitar préstamo', action: 'ApplyForLoan', data: '' },
  ];

  /** Variable que controla botón flotante */
  menuButtons: any = this.menuButtonsSelectNull;
  eventClickButtonSelectedData: any;

  /** Modal observation */
  statusModalMain: boolean = false;
  textFormObservaHeader: string = '';
  showSoliPrestamo: boolean = false;
  operationDialogObserva: string;
  routeProcess = `${environment.versionApiDefault}gestionArchivo/prestamo-documental/request-loan`;

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
      case 'ApplyForLoan':
        // Abre el modal
        this.statusModalMain = true; // Muestra el modal
        this.showSoliPrestamo = true; // Muestra los campos de solicitar prestamo
        this.textFormObservaHeader = event.title; // Asigna el titulo a mostrar
      break;
    }
  }

  /** Cerrar o desdruir componente observaciones */
  closeObserva(dataObserva) {

    // Inicio - Se reestablecen los valores que se muestran en el componente de observaciones
    this.statusModalMain = false; // oculta el modal
    this.showSoliPrestamo = false;
    // Fin reestablecer variables

    // dataObserva es la data que retorna el componente de observaciones
    if ( dataObserva.status ) {
      switch ( this.operationDialogObserva ) {
        case 'ApplyForLoan':
          this.floatingButtonService.changeApplyForLoan(this.eventClickButtonSelectedData, dataObserva.data, this.routeProcess);
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
        // Valida que no seleccione ningun prestamo
        if ( event[0].idStatusPrestamo == environment.statusLoanNumber.solicitudPrestamo || event[0].idStatusPrestamo == environment.statusLoanNumber.prestamoAprobado || event[0].idStatusPrestamo == environment.statusLoanNumber.prestamoPorAutorizar ) {
          this.menuButtons = this.menuButtonsSelectNull;
        } else {
          this.menuButtons = this.menuButtonsSelectOne;
        }
      } else { // Varios registros seleccionados
        this.menuButtons = this.menuButtonsSelectMasive;
        event.forEach( element => {
          if ( element.idStatusPrestamo == environment.statusLoanNumber.solicitudPrestamo  || element.idStatusPrestamo == environment.statusLoanNumber.prestamoAprobado ) {
            this.menuButtons = this.menuButtonsSelectNull;
          }
        });
      }
    } else { // Ningun registro seleccionado
      this.menuButtons = this.menuButtonsSelectNull;
    }
  }

}
