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
  selector: 'app-query-folder-adi-index',
  templateUrl: './query-folder-adi-index.component.html',
  styleUrls: ['./query-folder-adi-index.component.css']
})
export class QueryFolderAdiIndexComponent implements OnInit {

  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderIcon = 'folder';
  initCardHeaderTitle = 'Listado de expedientes';
  // Nombre del módulo donde se esta accediendo al initialList
  route: string = 'FolderAdi';
  // Autorizacion de localstorage
  authorization: string;
  // Version api
  versionApi = environment.versionApiDefault;
  // Ruta a redirigir
  redirectionPath = '/query/folder-adi-index';
  /** Formulario index */
  initBotonViewRoute: string = '/query/folder-adi-view'; // Ruta ver
  initBtnVersioningIndexteRoute: string = this.redirectionPath; // Ruta Index de versionamiento
  viewColumStatus = false; // Oculta la columna de status del initial list
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Consulta', 'route': '/query' },
  ];
  breadcrumbRouteActive = 'Expedientes ADI';
  // Configuraciones para datatables
  routeLoadDataTablesService: string = environment.versionApiDefault + 'consultas/expedientes-adi/index';

  dtTitles: any = [
    { 'title': 'Nombre expediente', 'data': 'nomExpediente' },
    { 'title': 'Número expediente', 'data': 'numExpediente' },
    { 'title': 'Fecha proceso', 'data': 'fechaExpediente' },
    { 'title': 'Descripción nombre expediente', 'data': 'desNomExp' },
    { 'title': 'Descripción', 'data': 'decripcion' },
    { 'title': 'Diferenciador', 'data': 'diferenciador' },
    { 'title': 'Documento Identificación', 'data': 'numeroIdentidad' },
    { 'title': 'Proveedor o tercero', 'data': 'nombreEntidad' },
    { 'title': 'Serie', 'data': 'serie' },
    { 'title': 'Subserie', 'data': 'subserie' },
    { 'title': 'Observación', 'data': 'observacion' },
  ];
  /** Fin Configuraciones para datatables */
  /** Fin Initial List */

  /**
   * Configuración para el botón flotante
   */
  menuButtonsSelectNull: any = [ ];
  menuButtonsSelectOne: any = [
    { icon: 'remove_red_eye', title: 'Ver', action: 'view', data: '' },
  ];
  menuButtonsSelectMasive: any = [];

  /** Variable que controla botón flotante */
  menuButtons: any = this.menuButtonsSelectNull;
  eventClickButtonSelectedData: any;

  constructor( private router: Router) { }

  ngOnInit() {
  }

  /**
   *
   * @param event
   * Procesando las opciones del menu flotante
   */
  menuReceiveData(event) {

    switch (event.action) {
      case 'view':
        this.router.navigate(['/' + this.initBotonViewRoute + '/' + this.eventClickButtonSelectedData[0]['data'][0] ]);
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
