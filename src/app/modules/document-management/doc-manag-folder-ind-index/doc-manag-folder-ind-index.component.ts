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
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FloatingButtonService } from 'src/app/services/floating-button.service';
import { ConvertParamsBase64Helper } from 'src/app/helpers/convert-params-base64.helper';

@Component({
  selector: 'app-doc-manag-folder-ind-index',
  templateUrl: './doc-manag-folder-ind-index.component.html',
  styleUrls: ['./doc-manag-folder-ind-index.component.css']
})
export class DocManagFolderIndIndexComponent implements OnInit {

  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderIcon = 'fact_check';
  initCardHeaderTitle = 'Indice';
  showButtonFiltrer = false; // oculta el boton de los filtros
  viewColumStatus = false; // oculta columna de estado
  // Nombre del módulo donde se esta accediendo al initialList
  route: string = 'Folder';
  // Autorizacion de localstorage
  authorization: string;
  // variable que guarda el id que llega por Get
  paramiD: string;
  paramOID = 0;
  // Version api
  versionApi = environment.versionApiDefault;
  // Ruta a redirigir
  redirectionPath = '/documentManagement/folder-index';
  statusCreateFolder: boolean = false; // Muestra el dialogo de crear expediente
  /** Formulario index */
  initBotonCreateRoute: string = ''; // Ruta del botón crear
  initBotonUpdateRoute: string = ''; // Ruta editar
  initBotonViewRoute: string = '/documentManagement/folder-view/'; // Ruta ver
  initBtnVersioningIndexteRoute: string = this.redirectionPath; // Ruta Index de versionamiento
  /** BreadcrumbOn  */
  breadcrumbOn = [];
  breadcrumbRouteActive = 'Indice';
  // Configuraciones para datatables
  routeLoadDataTablesService: string = environment.versionApiDefault + 'gestionDocumental/expedientes/indice';
  statusInitialList: boolean = true; // muestra el initial list
  // Configuración para el proceso change status
  routeChangeStatus: string = environment.versionApiDefault + 'gestionDocumental/expedientes/change-status';

  dtTitles: any = [
    { 'title': 'Contenido', 'data': 'indiceContenido' },
    { 'title': 'Nombre documento', 'data': 'nombreRadiDocumento' },
    { 'title': 'Tipo documental', 'data': 'nombreTipoDocumental' },
    { 'title': 'Fecha documento', 'data': 'creacionRadiDocumento' },
    { 'title': 'Fecha inclusión', 'data': 'creacionGdExpedienteInclusion' },
    { 'title': 'Valor huella', 'data': 'valorHuella' },
    { 'title': 'Función resumen', 'data': 'funcionResumen' },
    { 'title': 'Orden documento', 'data': 'ordenDocumento' },
    { 'title': 'Página inicio', 'data': 'paginaInicio' },
    { 'title': 'Página fin', 'data': 'paginaFinal' },
    { 'title': 'Formato', 'data': 'formato' },
    { 'title': 'Tamaño', 'data': 'tamanoRadiDocumento' },
    { 'title': 'Origen', 'data': 'origen' },
    
  ];
  /** Fin Configuraciones para datatables */
  /** Fin Initial List */

  /**
   * Configuración para el botón flotante
   */
  menuButtonsSelectNull: any = [];
  menuButtonsSelectOne: any = [];
  menuButtonsSelectMasive: any = [];

  /** Variable que controla botón flotante */
  menuButtons: any = this.menuButtonsSelectNull;
  eventClickButtonSelectedData: any;
  statusButton: boolean = true; // muestra el boton del index

  constructor( private routeParam: ActivatedRoute, private router: Router, private floatingButtonService: FloatingButtonService) {
    this.paramiD = this.routeParam.snapshot.paramMap.get('id'); // SE recibe el id
    this.paramOID = ConvertParamsBase64Helper(this.paramiD); // Se pasa al html como componete para que reciba el ID
    this.initBotonViewRoute = this.initBotonViewRoute + this.paramiD;
    this.breadcrumbOn = [
      { 'name': 'Gestión documental', 'route': '/documentManagement' },
      { 'name': 'Expedientes', 'route': this.redirectionPath },
      { 'name': 'Detalles', 'route': this.initBotonViewRoute }
    ];
   }

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
        // this.router.navigate(['/' + this.initBotonCreateRoute]);
        this.statusButton = false; // Oculta el boton del index
        this.statusInitialList = false; // oculta el initial list
        this.statusCreateFolder = true; // Abre el dialogo de crear expediente
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

  closeDialog(event) {
    // restaura las variables a su origen
    this.statusCreateFolder = false; // Dejar modal como oculto
    this.statusButton = true; // Oculta el boton del index
    this.statusInitialList = true; // oculta el initial list
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
