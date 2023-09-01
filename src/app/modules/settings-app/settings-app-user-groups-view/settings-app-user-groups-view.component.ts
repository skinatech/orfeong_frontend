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
import { ConvertParamsBase64Helper } from 'src/app/helpers/convert-params-base64.helper';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { RestService } from 'src/app/services/rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-settings-app-user-groups-view',
  templateUrl: './settings-app-user-groups-view.component.html',
  styleUrls: ['./settings-app-user-groups-view.component.css']
})
export class SettingsAppUserGroupsViewComponent implements OnInit {

  // Autorizacion de localstorage
  authorization: string;
  // variable que guarda el id que llega por Get
  paramiD: string;
  paramOID: string;

  // Ruta de actualización
  routeBotonUpdateView: string = '/setting/user-groups-update/';
  // Icono del ViewList
  initCardHeaderIcon = 'edit_location';
  // Ruta a redirigir
  redirectionPath = '/setting/user-groups-index';
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Configuración', 'route': '/setting' },
    { 'name': 'Grupo de usuarios', 'route': this.redirectionPath }
  ];
  breadcrumbRouteActive = 'Detalles';
  
  /**
   * Configuración para el botón flotante
   */
  iconMenu: string = 'edit';
  
  /** Initial List */
  initBotonCreateRoute: string = ''; // Ruta del botón crear
  initCardHeaderStatus = true;
  initCardHeaderTitle = 'Listado de usuarios del grupo';
  // Nombre del módulo donde se esta accediendo al initialList
  routeData: string = 'userGroups';
  // Version api
  versionApi = environment.versionApiDefault;

  initBtnVersioningIndexteRoute: string = this.redirectionPath; // Ruta Index
  // Configuraciones para datatables
  routeLoadDataTablesService: any = environment.versionApiDefault + 'configuracionApp/grupos-usuarios/view'; // Trae data de la misma forma del index

  dtTitles: any = [
    { 'title': 'Grupo', 'data': 'nombreGrupo' },
    { 'title': 'Dependencia', 'data': 'dependencia' },
    { 'title': 'Usuario', 'data': 'nombreUsuario' },
  ];
  /** Fin Configuraciones para datatables */

  viewColumStatus: boolean = false;
  /** Fin Initial List */

  constructor(private route: ActivatedRoute, public lhs: LocalStorageService, public sweetAlertService: SweetAlertService, public restService: RestService, private router: Router) { 
    this.paramiD = this.route.snapshot.paramMap.get('id'); // SE recibe el id
    this.paramOID = ConvertParamsBase64Helper(this.paramiD); // Se pasa al html como componete para que reciba el ID
    this.routeBotonUpdateView = this.routeBotonUpdateView + this.paramiD;
  }

  ngOnInit() { }

  menuPrimaryReceiveData(event) {
    this.router.navigate(['/' + this.routeBotonUpdateView]);
  }

  /** Filas seleccionadas del initial list */
  selectedRowsReceiveData($event) { }

}
