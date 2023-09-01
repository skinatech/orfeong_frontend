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
  selector: 'app-settings-app-region-index',
  templateUrl: './settings-app-region-index.component.html',
  styleUrls: ['./settings-app-region-index.component.css']
})
export class SettingsAppRegionIndexComponent implements OnInit {

  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderIcon = 'add_business';
  initCardHeaderTitle = 'Lista principal y regionales';
  // Nombre del módulo donde se esta accediendo al initialList
  route: string = 'Region';
  // Autorizacion de localstorage
  authorization: string;
  // Version api
  versionApi = environment.versionApiDefault;
  // Ruta a redirigir
  redirectionPath = '/setting/region-index';
  /** Formulario index */
  initBotonCreateRoute: string = '/setting/region-create'; // Ruta del botón crear
  initBotonUpdateRoute: string = '/setting/region-update'; // Ruta editar
  initBotonViewRoute: string = '/setting/region-view'; // Ruta ver
  initBotonMassiveRoute: string = '/setting/region-massive'; // Ruta cargar archivo
  initBtnVersioningIndexteRoute: string = this.redirectionPath; // Ruta Index de versionamiento
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Configuración', 'route': '/setting' },
  ];
  breadcrumbRouteActive = 'Principal y regionales';
  // Configuraciones para datatables
  routeLoadDataTablesService: string = environment.versionApiDefault + 'configuracionApp/regionales/index';
  // Configuración para el proceso change status
  routeChangeStatus: string = environment.versionApiDefault + 'configuracionApp/regionales/change-status';

  dtTitles: any = [
    { 'title': 'Regional', 'data': 'regionalName' },
    { 'title': 'Sigla', 'data':'regionalInitials'},
    { 'title': 'País', 'data': 'country' },
    { 'title': 'Departamento', 'data': 'department' },
    { 'title': 'Municipio', 'data': 'municipality' },
    { 'title': 'Fecha creación', 'data': 'creacion' },
  ];
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
    { icon: 'autorenew', title: 'Cambiar estado', action: 'changeStatus', data: '' },
  ];

  /** Variable que controla botón flotante */
  menuButtons: any = this.menuButtonsSelectNull;
  eventClickButtonSelectedData: any;

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

}
