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

@Component({
  selector: 'app-users-operations-index',
  templateUrl: './users-operations-index.component.html',
  styleUrls: ['./users-operations-index.component.css']
})
export class UsersOperationsIndexComponent implements OnInit {

  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderIcon = 'build';
  initCardHeaderTitle = 'Listado de operaciones';
  route: string = 'Operaciones';
  /** Formulario index */
  initBotonCreateText: string = 'Crear'; // Texto del botón crear
  initBotonCreateRoute: string = '/users/operations-create'; // Ruta del botón crear
  initBotonUpdateRoute: string = '/users/operations-update'; // Ruta editar usuario
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Gestión de usuarios', 'route': '/users' }
  ];
  breadcrumbRouteActive = 'Administrar operaciones';

  /** Configuraciones para datatables */
  routeLoadDataTablesService: string = environment.versionApiDefault + 'roles/roles-operaciones/index';
  dtTitles: any = [
    { 'title': 'Nombre', 'data': 'aliasRolOperacion' },
    { 'title': 'Ruta', 'data': 'nombreRolOperacion' },
    { 'title': 'Módulo operación', 'data': 'moduloRolOperacion' },
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
    { icon: 'edit', title: 'Editar', action: 'edit', data: '' }
  ];
  menuButtonsSelectMasive: any = [
    { icon: 'add', title: 'Agregar', action: 'add', data: '' }
  ];

  /** Variable que controla botón flotante */
  menuButtons: any = this.menuButtonsSelectNull;

  eventClickButtonUpdateOrView: any;

  constructor(private router: Router) { }

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
        this.router.navigate(['/' + this.initBotonUpdateRoute + '/' + this.eventClickButtonUpdateOrView[0]['data'][0]]);
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
        this.eventClickButtonUpdateOrView = event;
        this.menuButtons = this.menuButtonsSelectOne;
      } else { // Varios registros seleccionados
        this.menuButtons = this.menuButtonsSelectMasive;
      }
    } else { // Ningun registro seleccionado
      this.menuButtons = this.menuButtonsSelectNull;
    }
  }


}
