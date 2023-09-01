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
  selector: 'app-arc-manag-archive-filing-index',
  templateUrl: './arc-manag-archive-filing-index.component.html',
  styleUrls: ['./arc-manag-archive-filing-index.component.css']
})
export class ArcManagArchiveFilingIndexComponent implements OnInit {

  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderIcon = 'batch_prediction';
  initCardHeaderTitle = 'Listado de expedientes';
  // Nombre del módulo donde se esta accediendo al initialList
  route: string = 'ManagementArchive';
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
  breadcrumbRouteActive = 'Archivar expediente';
  statusButtonIndex = true; // muestra el boton del index
  // Configuraciones para datatables
  routeLoadDataTablesService: string = environment.versionApiDefault + 'gestionArchivo/gestion-archivo/index';
  // Configuración para el proceso change status
  routeChangeStatus: string = '';
  statusArchiveModal = false; // Muestra el modal de archivar
  dtTitles: any = [
    { 'title': 'Número expediente', 'data': 'numeroExpediente' },
    { 'title': 'Expediente', 'data': 'nombreExpediente' },
    { 'title': 'Descripcion', 'data': 'descripcionExpediente' },
    { 'title': 'Serie', 'data': 'codigoSerie' },
    { 'title': 'Subserie', 'data': 'codigoSubSerie' },
    { 'title': 'Creacion', 'data': 'creacionExpediente' },
    { 'title': 'Tiempo en gestion', 'data': 'tiempoGestion' },
    { 'title': 'Tiempo en central', 'data': 'tiempoCentral' },
    { 'title': 'Espacio físico', 'data': 'espacioFisicoText' },
  ];
  /** Fin Configuraciones para datatables */
  /** Fin Initial List */

  /**
   * Configuración para el botón flotante
   */
  menuButtonsSelectNull: any = [];
  menuButtonsSelectOne: any = [
    { icon: 'batch_prediction', title: 'Archivar', action: 'archiveFiling', data: '' },
    { icon: 'remove_red_eye', title: 'Ver ubicación', action: 'view', data: '' }
  ];
  menuButtonsSelectOneArchive: any = [
    { icon: 'sticky_note_2', title: 'Rótulo de carpeta', action: 'rotuloCarpeta', data: '' },
    { icon: 'source', title: 'Rótulo de caja', action: 'rotuloCaja', data: '' },
    { icon: 'remove_red_eye', title: 'Ver ubicación', action: 'view', data: '' },
  ];
  menuButtonsSelectMasive: any = [
    { icon: 'batch_prediction', title: 'Archivar', action: 'archiveFiling', data: '' },
  ];
  menuButtonsSelectMasiveArchive: any = [
    { icon: 'source', title: 'Rótulo de caja', action: 'rotuloCaja', data: '' },
  ];

  /** Variable que controla botón flotante */
  menuButtons: any = this.menuButtonsSelectNull;
  eventClickButtonSelectedData: any;
  operationButton: string;
  initialNotificationStatus = true; // Muestra el mensaje de información
  valueExpeIni = 0; // valor del id de expediente

  constructor( private router: Router, private floatingButtonService: FloatingButtonService)  { }

  ngOnInit() {
  }

  /**
   *
   * @param event
   * Procesando las opciones del menu flotante
   */
  menuReceiveData(event) {

    switch (event.action) {
      case 'archiveFiling':
        this.statusArchiveModal = true; // muestra le modal
        this.statusButtonIndex = false; // oculta el boton del index
        this.operationButton = event.action;
        // this.floatingButtonService.changeTransactionArchiveFiling(this.eventClickButtonSelectedData);
      break;
      case 'view':
        this.router.navigate(['/' + this.initBotonViewRoute + '/' + this.eventClickButtonSelectedData[0]['data'][0]]);
      break;
      case 'rotuloCarpeta':
          this.floatingButtonService.changeDownloadRotulos(this.eventClickButtonSelectedData,  {typeRotulo: 'Carpeta'}   );
      break;
      case 'rotuloCaja':
          this.floatingButtonService.changeDownloadRotulos(this.eventClickButtonSelectedData,  {typeRotulo: 'Caja'}   );
      break;
    }
  }

  closeModal(dataModal) {
    // console.log(dataModal);
    this.statusArchiveModal = false; // muestra le modal
    this.statusButtonIndex = true; // muestra el boton del index
    if ( dataModal.status ) {
      switch (this.operationButton) {
        case 'archiveFiling':
          this.floatingButtonService.changeTransactionArchiveFiling(this.eventClickButtonSelectedData, dataModal.data );
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

    let validaEstado: any;
    let expeIniStatus: boolean = true;
    
    if (event.length > 0) {

      // Asigna el primer valor del registro seleccionado
      validaEstado = event[0].espacioFisicoStatus;
      this.valueExpeIni = event[0].idExpediente;

      if (event.length == 1) { // Un registro seleccionado
        this.eventClickButtonSelectedData = event;
        // Valdia si el estado de espacio fisico del radicado
        if ( event[0].espacioFisicoStatus ) {
          this.menuButtons = this.menuButtonsSelectOneArchive;
        } else {
          this.menuButtons = this.menuButtonsSelectOne;
        }
      } else {
        // Varios registros seleccionados
        event.forEach( data => {
          if ( validaEstado == data.espacioFisicoStatus ) {
            // Valida el estado true de espacio fisico masivo
            if ( data.espacioFisicoStatus ) {
              this.menuButtons = this.menuButtonsSelectMasiveArchive;
            } else {
              // valida el id de expediente para asignar masivamente 
              if(this.valueExpeIni != data.idExpediente ){
                expeIniStatus = false;
              }
              // Valida que el estado sea true
              if( expeIniStatus ) {
                this.menuButtons = this.menuButtonsSelectMasive;
              }else{
                this.menuButtons = this.menuButtonsSelectNull;
              }
            }
          } else {
            this.menuButtons = this.menuButtonsSelectNull;
          }
        });
      }
    } else { // Ningun registro seleccionado
      this.menuButtons = this.menuButtonsSelectNull;
    }
  }

}
