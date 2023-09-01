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
  selector: 'app-doc-loans-loan-of-files-index',
  templateUrl: './doc-loans-loan-of-files-index.component.html',
  styleUrls: ['./doc-loans-loan-of-files-index.component.css']
})
export class DocLoansLoanOfFilesIndexComponent implements OnInit {

  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderIcon = 'credit_score';
  initCardHeaderTitle = 'Listado de expedientes';
  // Nombre del módulo donde se esta accediendo al initialList
  route: string = 'LoanOfFiles';
  // Autorizacion de localstorage
  authorization: string;
  // Version api
  versionApi = environment.versionApiDefault;
  /** Formulario index */
  initBotonCreateRoute: string = ''; // Ruta del botón crear
  initBotonUpdateRoute: string = ''; // Ruta editar
  initBotonViewRoute: string = ''; // Ruta ver
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Préstamo de expedientes', 'route': '/documentaryLoans' },
  ];
  breadcrumbRouteActive = 'Préstamo de expedientes';
  // Configuraciones para datatables
  routeLoadDataTablesService: string = environment.versionApiDefault + 'gestionArchivo/prestamo-documental/index-loan-files';

  dtTitles: any = [
    { 'title': 'Número expendiente', 'data': 'fileNumber' },
    { 'title': 'Nombre expendiente', 'data': 'fileName' },
    { 'title': 'Dependencia responsable', 'data': 'dependency' },
    { 'title': 'Usuario responsable', 'data': 'user' },
    { 'title': 'Bodega', 'data': 'store' },
    { 'title': 'Estante', 'data': 'rack' },
    { 'title': 'Entrepaño', 'data': 'shelf' },
    { 'title': 'Caja', 'data': 'box' }
  ];
  /** Fin Configuraciones para datatables */
  /** Fin Initial List */

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
  routeProcess = `${environment.versionApiDefault}gestionArchivo/prestamo-documental/request-loan-files`;

  constructor(
    private router: Router,
    private floatingButtonService: FloatingButtonService
  ) { }

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
        this.statusModalMain = true; // Muestra el modal
        this.showSoliPrestamo = true; // Muestra los campos de solicitar prestamo
        this.textFormObservaHeader = event.title; // Asigna el titulo a mostrar
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
        // Valida que no seleccione ningun prestamo
        if ( event[0].idStatusPrestamo == environment.statusLoanNumber.solicitudPrestamo || event[0].idStatusPrestamo == environment.statusLoanNumber.prestamoAprobado || event[0].idStatusPrestamo == environment.statusLoanNumber.prestamoPorAutorizar ) {
          this.menuButtons = this.menuButtonsSelectNull;
        } else {
          this.menuButtons = this.menuButtonsSelectOne;
        }
      } else { // Varios registros seleccionados
        this.menuButtons = this.menuButtonsSelectMasive;
        event.forEach( element => {
          if ( element.idStatusPrestamo == environment.statusLoanNumber.solicitudPrestamo || element.idStatusPrestamo == environment.statusLoanNumber.prestamoAprobado ) {
            this.menuButtons = this.menuButtonsSelectNull;
          }
        });
      }
    } else { // Ningun registro seleccionado
      this.menuButtons = this.menuButtonsSelectNull;
    }
  }

  /** Cerrar o desdruir componente observaciones */
  closeObserva(dataObserva) {
    this.statusModalMain = false; // oculta el modal
    this.showSoliPrestamo = false;

    if(dataObserva.status) {
      switch ( this.operationDialogObserva ) {
        case 'ApplyForLoan':
          this.floatingButtonService.changeApplyForLoan(this.eventClickButtonSelectedData, dataObserva.data, this.routeProcess);
        break;
      }
    }
  }
}
