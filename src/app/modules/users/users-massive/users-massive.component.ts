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

import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormControl } from '@angular/forms';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { RestService } from 'src/app/services/rest.service';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { GlobalAppService } from 'src/app/services/global-app.service';

@Component({
  selector: 'app-users-massive',
  templateUrl: './users-massive.component.html',
  styleUrls: ['./users-massive.component.css']
})
export class UsersMassiveComponent implements OnInit {

  public submitFormEmit = new EventEmitter<any>();

  // Nombre del formulario
  textForm = 'Proceso masivo';
  // Icono del formulario
  initCardHeaderIcon = 'group';
  // Autentificacion
  authorization: string;
  // variable que guarda el id que llega por Get
  paramiD: string;
  paramOID: string;
  paramName: string;
  paramOName: string;
  filesUploadCount: any;

  /** Las variables para mostrar la alerta informativa  */
  subMenuNotificationStatusTable: boolean = true;

  dataSend: object; // Objeto que se envia al back como parametro requestç
  redirectActive = true; // Redirecciona
  redirectionPath = '/users/users-index/false'; // Ruta a redirigir en caso de que el usuario no posea permisos para realizar la accion
  showButtonDowload: boolean = true;
  validateFile: any = [{ type: 'xls' }, { type: 'xlsx' }];

  /** Boton flotante */
  iconMenu: string = 'save';
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Gestión de usuarios', 'route': '/users' },
    { 'name': 'Administrar usuario', 'route': '/users/users-index/false' }
  ];
  breadcrumbRouteActive = 'Proceso masivo';
  /**Variable del formulario */
  moduleForm: UntypedFormGroup;
  /**
   * Configuraciones para los servicios
   */
  responseServiceFormSubmit: any;
  responseServiceFormSubmitErr: any;
  /** Archivos */
  ruoteServiceDocuments: string = environment.apiUrl + environment.versionApiDefault + 'user/load-massive-file';
  
  constructor ( private formBuilder: UntypedFormBuilder, public sweetAlertService: SweetAlertService, public restService: RestService, public lhs: LocalStorageService, private router: Router, private route: ActivatedRoute, public globalAppService: GlobalAppService) { 
   
  }

  ngOnInit() {
  
  }

}
