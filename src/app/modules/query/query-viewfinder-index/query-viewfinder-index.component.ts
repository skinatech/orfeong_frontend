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
  selector: 'app-query-viewfinder-index',
  templateUrl: './query-viewfinder-index.component.html',
  styleUrls: ['./query-viewfinder-index.component.css']
})
export class QueryViewfinderIndexComponent implements OnInit {

  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderIcon = 'note';
  initCardHeaderTitle = 'Listado de radicados';
  // Nombre del módulo donde se esta accediendo al initialList
  route: string = 'Viewfinder';
  // Autorizacion de localstorage
  authorization: string;
  // Version api
  versionApi = environment.versionApiDefault;
  // Ruta a redirigir
  redirectionPath = '/query/viewfinder-index';
  /** Formulario index */
  initBotonViewRoute: string = '/query/viewfinder-view'; // Ruta ver
  initBtnVersioningIndexteRoute: string = this.redirectionPath; // Ruta Index de versionamiento
  viewColumStatus = false; // Oculta la columna de status del initial list
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Consulta', 'route': '/query' },
  ];
  breadcrumbRouteActive = 'Radicados ADI';
  // Configuraciones para datatables
  routeLoadDataTablesService: string = environment.versionApiDefault + 'consultas/consulta-adi/index';

  dtTitles: any = [
    { 'title': 'Número radicado', 'data': 'numRadicado' },
    { 'title': 'Fecha radicado', 'data': 'fechaRadicado' },
    { 'title': 'Asunto', 'data': 'asunto' },
    { 'title': 'Dependencia', 'data': 'dependencia' },
    { 'title': 'Funcionario', 'data': 'funcionario' },
    { 'title': 'Proveedor o tercero', 'data': 'proveedor' },
    { 'title': 'Destinatario', 'data': 'destinatario' },
    { 'title': 'Tipo documental', 'data': 'tipoDocumental' },
    { 'title': 'Nombre expediente', 'data': 'nomExpediente' },
    { 'title': 'Número expediente', 'data': 'numExpediente' },
    { 'title': 'Serie', 'data': 'serie' },
    { 'title': 'Subserie', 'data': 'subserie' },
    { 'title': 'Observación', 'data': 'observacion' },
    { 'title': 'Referencia', 'data': 'referencia' },
    { 'title': 'Prioridad',         'data': 'prioridad' },
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
        this.router.navigate(['/' + this.initBotonViewRoute + '/' + this.eventClickButtonSelectedData[0]['data'][0]  + '/' + this.eventClickButtonSelectedData[0]['data'][1] ]);
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
