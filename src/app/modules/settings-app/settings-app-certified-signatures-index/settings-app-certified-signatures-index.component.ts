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
  selector: 'app-settings-app-certified-signatures-index',
  templateUrl: './settings-app-certified-signatures-index.component.html',
  styleUrls: ['./settings-app-certified-signatures-index.component.css']
})
export class SettingsAppCertifiedSignaturesIndexComponent implements OnInit {

  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderIcon = 'verified_user';
  initCardHeaderTitle = 'Listado de Firmas Certificadas';
  // Nombre del módulo donde se esta accediendo al initialList
  route: string = 'Providers';
  // Autorizacion de localstorage
  authorization: string;
  // Version api
  versionApi = environment.versionApiDefault;
  // Ruta a redirigir
  redirectionPath = '/setting/certified-signatures-index';
  /** Formulario index */
  initBotonCreateRoute: string = '/setting/certified-signatures-create'; // Ruta del botón crear
  initBotonUpdateRoute: string = '/setting/certified-signatures-update'; // Ruta editar
  initBotonViewRoute: string = '/setting/certified-signatures-view'; // Ruta ver

  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Configuración', 'route': '/setting' },
  ];
  breadcrumbRouteActive = 'Proveedores Firmas Certificadas';
  // Configuraciones para datatables
  routeLoadDataTablesService: string = environment.versionApiDefault + 'configuracionApp/cg-firmas-certificadas/index';
  // Configuración para el proceso change status
  routeChangeStatus: string = environment.versionApiDefault + 'configuracionApp/cg-firmas-certificadas/change-status';

  dtTitles: any = [
    { 'title': 'Nombre Firma Certificada', 'data': 'nombreCgFirmaCertificada' },
    { 'title': 'Ruta Conexión', 'data': 'rutaCgFirmaCertificada' },
    { 'title': 'Autorización Conexión', 'data': 'autorizacionCgFirmaCertificada' },
    { 'title': 'Fecha creación', 'data': 'creacion' },
  ];

  showButtonFiltrer = false;
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
    { icon: 'autorenew', title: 'Cambiar estado', action: 'changeStatus', data: '' },
  ];

  /** Variable que controla botón flotante */
  menuButtons: any = this.menuButtonsSelectNull;
  eventClickButtonSelectedData: any;

  constructor(private router: Router, private floatingButtonService: FloatingButtonService) { }

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
