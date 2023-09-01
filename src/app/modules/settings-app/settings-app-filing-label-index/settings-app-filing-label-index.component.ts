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
import { environment } from 'src/environments/environment';
import { FloatingButtonService } from 'src/app/services/floating-button.service';

@Component({
  selector: 'app-settings-app-filing-label-index',
  templateUrl: './settings-app-filing-label-index.component.html',
  styleUrls: ['./settings-app-filing-label-index.component.css']
})
export class SettingsAppFilingLabelIndexComponent implements OnInit {

  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderIcon = 'point_of_sale';
  initCardHeaderTitle = 'Listado de etiquetas';
  // Nombre del módulo donde se esta accediendo al initialList
  route: string = 'FilingLabel';
  // Autorizacion de localstorage
  authorization: string;
  // Version api
  versionApi = environment.versionApiDefault;
  // Ruta a redirigir
  redirectionPath = '/setting/poll-index';
  /** Formulario index */
  initBotonCreateRoute: string = '/setting/filing-label-create'; // Ruta del botón crear
  initBotonUpdateRoute: string = '/setting/filing-label'; // Ruta editar
  initBotonViewRoute: string = '/setting/filing-label'; // Ruta ver
  initBtnVersioningIndexteRoute: string = this.redirectionPath; // Ruta Index de versionamiento
  initialNotificationStatus = true; // muestra la notificacion
  initialNotificationMessage = 'textFormFilingLabel';
  showButtonFiltrer = false; // oculta el boton de los filtros

  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Configuración', 'route': '/setting' },
  ];
  breadcrumbRouteActive = 'Etiqueta radicación';
  // Configuraciones para datatables
  routeLoadDataTablesService: string = environment.versionApiDefault + 'configuracionApp/configuracion-general/index-label';
  // Configuración para el proceso change status
  routeChangeStatus: string = environment.versionApiDefault + 'configuracionApp/configuracion-general/change-status-label';

  dtTitles: any = [
    { 'title': 'Etiqueta', 'data': 'label' },
    { 'title': 'Descripción', 'data': 'description' },
    { 'title': 'Fecha', 'data': 'date' },
  ];
  /** Fin Configuraciones para datatables */
  /** Fin Initial List */

  /**
   * Configuración para el botón flotante
   */
  menuButtonsSelectNull: any = [];
  menuButtonsSelectOne: any = [
    { icon: 'autorenew', title: 'Cambiar estado', action: 'changeStatus', data: '' },
  ];
  menuButtonsSelectMasive: any = [
    { icon: 'autorenew', title: 'Cambiar estado', action: 'changeStatus', data: '' },
  ];

  /** Variable que controla botón flotante */
  menuButtons: any = this.menuButtonsSelectNull;
  eventClickButtonSelectedData: any;

  constructor(private floatingButtonService: FloatingButtonService) { }

  ngOnInit() {
  }

  /**
   *
   * @param event
   * Procesando las opciones del menu flotante
   */
  menuReceiveData(event) {

    switch (event.action) {
      case 'changeStatus':
        this.floatingButtonService.changeStatus(this.eventClickButtonSelectedData);
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

}
