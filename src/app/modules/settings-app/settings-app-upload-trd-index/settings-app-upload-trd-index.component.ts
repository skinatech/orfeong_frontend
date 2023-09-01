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
  selector: 'app-settings-app-upload-trd-index',
  templateUrl: './settings-app-upload-trd-index.component.html',
  styleUrls: ['./settings-app-upload-trd-index.component.css']
})
export class SettingsAppUploadTrdIndexComponent implements OnInit {

  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderIcon = 'settings_applications';
  initCardHeaderTitle = 'Listado de configuración de cargas TRD';
  // Nombre del módulo donde se esta accediendo al initialList
  route: string = 'UploadTRD';
  /** Formulario index */
  initBotonCreateRoute: string = '/setting/upload-trd-create'; // Ruta del botón crear
  initBotonUpdateRoute: string = '/setting/upload-trd-update'; // Ruta editar
  initBotonViewRoute: string = '/setting/upload-trd-view'; // Ruta ver
  initBtnVersioningIndexteRoute: string = '/setting/version-trd-index'; // Ruta Index de versionamiento
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Configuración', 'route': '/setting' },
  ];
  breadcrumbRouteActive = 'Configuración carga TRD';

  // Configuraciones para datatables
  routeLoadDataTablesService: string = environment.versionApiDefault + 'configuracionApp/cg-trd/index';
  // Configuración para el proceso change status
  routeChangeStatus: string = environment.versionApiDefault + 'configuracionApp/cg-trd/change-status';
  
  dtTitles: any = [
    { 'title': 'Máscara', 'data': 'nombreCgTrdMascara' },
    { 'title': 'Código dependencia', 'data': 'cellDependenciaCgTrd' },
    { 'title': 'Unidad administrativa', 'data': 'cellDependenciaPadreCgTrd' },
    { 'title': 'Nombre dependencia', 'data': 'cellTituloDependCgTrd' },
    { 'title': 'Regional', 'data': 'cellRegionalCgTrd' },
    { 'title': 'Inicio datos', 'data': 'cellDatosCgTrd' },
    { 'title': 'Columna código dependencia', 'data': 'columnCodigoCgTrd' },
    { 'title': 'Columna código serie', 'data': 'column2CodigoCgTrd' },
    { 'title': 'Columna código subserie', 'data': 'column3CodigoCgTrd' },
    { 'title': 'Columna nombre', 'data': 'columnNombreCgTrd' },
    { 'title': 'Columna norma', 'data': 'columnNormaCgTrd' },
    { 'title': 'Columna soporte P', 'data': 'columnPSoporteCgTrd' },
    { 'title': 'Columna soporte E', 'data': 'columnESoporteCgTrd' },
    { 'title': 'Columna soporte O', 'data': 'columnOsoporteCgTrd' },
    { 'title': 'Columna años gestión', 'data': 'columnAgCgTrd' },
    { 'title': 'Columna años central', 'data': 'columnAcCgTrd' },
    { 'title': 'Columna disposición CT', 'data': 'columnCtCgTrd' },
    { 'title': 'Columna disposición E', 'data': 'columnECgTrd' },
    { 'title': 'Columna disposición S', 'data': 'columnSCgTrd' },
    { 'title': 'Columna Disposición M/D', 'data': 'columnMCgTrd' },
    { 'title': 'Columna procedimiento', 'data': 'columnProcessCgTrd' },
    { 'title': 'Días tipo documental', 'data': 'columnTipoDocCgTrd' },
  ];
  /** Fin Configuraciones para datatables */
  
  /** Variables para la notificacion inicial (variables seran traducidas) */
  initialNotificationStatus: boolean = true;
  initialNotificationMessage: string = "initialNotificationTrd";
  /** Fin Initial List */

  /**
   * Configuración para el botón flotante
   */
  menuButtonsSelectNull: any = [
    { icon: 'add', title: 'Agregar', action: 'add', data: '' },
    // { icon: 'bookmarks', title: 'Versionamiento TRD', action: 'versioning', data: '' },
  ];
  menuButtonsSelectOne: any = [
    { icon: 'add', title: 'Agregar', action: 'add', data: '' },
    // { icon: 'edit', title: 'Editar', action: 'edit', data: '' },
    { icon: 'remove_red_eye', title: 'Ver', action: 'view', data: '' },
    // { icon: 'bookmarks', title: 'Versionamiento TRD', action: 'versioning', data: '' },
    // { icon: 'autorenew', title: 'Cambiar estado', action: 'changeStatus', data: '' },
  ];
  menuButtonsSelectMasive: any = [
    { icon: 'add', title: 'Agregar', action: 'add', data: '' },
    // { icon: 'bookmarks', title: 'Versionamiento TRD', action: 'versioning', data: '' },
  ];

  showButtonFiltrer: boolean = false;

  /** Variable que controla botón flotante */
  menuButtons: any = this.menuButtonsSelectNull;
  eventClickButtonSelectedData: any;

  constructor( private router: Router, private floatingButtonService: FloatingButtonService ) { }

  ngOnInit() {
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
      // case 'versioning':
      //     this.router.navigate(['/' + this.initBtnVersioningIndexteRoute]);
      // break;
      /*case 'changeStatus':
        this.floatingButtonService.changeStatus(this.eventClickButtonSelectedData);
      break;*/
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
