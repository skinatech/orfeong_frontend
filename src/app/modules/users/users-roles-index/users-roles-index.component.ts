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
import { AuthService } from 'src/app/services/auth.service';
import { FloatingButtonService } from 'src/app/services/floating-button.service';

@Component({
  selector: 'app-users-roles-index',
  templateUrl: './users-roles-index.component.html',
  styleUrls: ['./users-roles-index.component.css']
})
export class UsersRolesIndexComponent implements OnInit {

  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderIcon = 'people';
  initCardHeaderTitle = 'Listado de perfiles';
  route: string = 'Roles';
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Gestión de usuarios', 'route': '/users' }
  ];
  breadcrumbRouteActive = 'Administrar perfiles';
  /** Formulario index */
  initBotonCreateText: string = 'Crear'; // Texto del botón crear
  initBotonCreateRoute: string = '/users/roles-create'; // Ruta del botón crear
  initBotonUpdateRoute: string = '/users/roles-update'; // Ruta editar usuario
  initBotonViewRoute: string = '/users/roles-view'; // Ruta ver usuario
  initBotonDocumentaryRoute: string = '/users/documentary-types-update'; // Ruta editar tipos documentales
  initBotonFilingRoute: string = '/users/filing-types-update'; // Ruta editar tipos de radicados

  /** Configuraciones para datatables */
  routeLoadDataTablesService: string = environment.versionApiDefault + 'roles/roles/index';
  dtTitles: any = [
    { 'title': 'Perfil', 'data': 'nombreRol' },
    { 'title': 'Fecha creación', 'data': 'creacionRol' }
  ];
  /** Fin Configuraciones para datatables */
  /** Fin Initial List */

  /**
   * Configuración para el botón flotante
   */
  menuButtonsSelectNull: any = [
    { icon: 'add', title: 'Agregar', action: 'add', data: '' }
  ];
  menuButtonsSelectOne: any = [
    { icon: 'add', title: 'Agregar', action: 'add', data: '' },
    { icon: 'edit', title: 'Editar', action: 'edit', data: '' },
    { icon: 'remove_red_eye', title: 'Ver', action: 'view', data: '' },
    { icon: 'autorenew', title: 'Cambiar estado', action: 'changeStatus', data: '' },
    { icon: 'assignment', title: 'Asignación tipos documentales', action: 'documentaryTypes', data: '' },
    { icon: 'description', title: 'Asignación tipos de radicado', action: 'filingTypes', data: '' },
  ];
  menuButtonsSelectMasive: any = [
    { icon: 'add', title: 'Agregar', action: 'add', data: '' },
    { icon: 'autorenew', title: 'Cambiar estado', action: 'changeStatus', data: '' }
  ];

  /** Variable que controla botón flotante */
  menuButtons: any = this.menuButtonsSelectNull;
  eventClickButtonSelectedData: any;

  /**
   * Configuración para el proceso change status
   */
  routeChangeStatus: string = environment.versionApiDefault + 'roles/roles/change-status';

  constructor(private router: Router, private floatingButtonService: FloatingButtonService, private authService: AuthService) { }

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
      case 'documentaryTypes':
        // Ruta para editar tipos documentales
        this.router.navigate(['/' + this.initBotonDocumentaryRoute + '/' + this.eventClickButtonSelectedData[0]['data'][0] + '/' + this.eventClickButtonSelectedData[0]['data'][1] ]);
      break;
      case 'filingTypes':
        // Ruta para editar tipos de radicado
        this.router.navigate(['/' + this.initBotonFilingRoute + '/' + this.eventClickButtonSelectedData[0]['data'][0] + '/' + this.eventClickButtonSelectedData[0]['data'][1] ]);
      break;
    }
  }

  /**
   *
   * @param event
   * Recibe la data de los registros a lo que se les hizo clic
   */
  selectedRowsReceiveData(event) {
    if(event.length > 0) {
      if(event.length == 1) { // Un registro seleccionado
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
