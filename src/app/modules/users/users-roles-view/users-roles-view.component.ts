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
import { Router, ActivatedRoute } from '@angular/router';
import { ConvertParamsBase64Helper } from 'src/app/helpers/convert-params-base64.helper';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { environment } from 'src/environments/environment';
import { RestService } from '../../../services/rest.service';
import { GlobalAppService } from 'src/app/services/global-app.service';

// Lista de busqueda
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface ListaBusq {
  id: string;
  val: string;
}
@Component({
  selector: 'app-users-roles-view',
  templateUrl: './users-roles-view.component.html',
  styleUrls: ['./users-roles-view.component.css']
})
export class UsersRolesViewComponent implements OnInit {
  
  // Autentificacion
  authorization: string;
  // Parametro de operaciones
  paramOID = 0;
  // Nombre del boton
  textButtonForm = 'Volver';
  // Nombre del formulario
  textFormRol = 'Detalle del perfil';
  // variable que guarda el id que llega por Get
  paramiD: string;
  // Icono del formulario
  initCardHeaderIcon = 'people';
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Gestión de usuarios', 'route': '/users' },
    { 'name': 'Administrar perfiles', 'route': '/users/roles-index' }
  ];
  breadcrumbRouteActive = 'Detalle';
  redirectionPath: string = '/users/roles-index'; // ruta a redirigir en caso de que el usuario no posea permisos para realizar la accion
  versionApi = environment.versionApiDefault;
  /**
   * Configuración para el botón flotante
   */
  iconMenu: string = 'edit';
  // Ruta a actualizar en el ViewList
  routeBotonUpdateView: string = 'users/roles-update/';
  /**
   * Configuraciones para los servicios
   */
  responseServiceFormSubmit: any;
  responseServiceFormSubmitErr: any;
  responseServiceOperations: any;
  responseServiceOperationsErr: any;
  resSerlistNivelBusq: any;
  resSerlistNivelBusqErr: any;
  rolesForm: UntypedFormGroup;
  type: UntypedFormGroup;
  modulosRol: any;
  operations: any;
  dataOperationsTrue: Array<any> = [];

  listNivelBusq: any;

  /** lists filtered + namelist by search keyword */
  filteredlistNivelBusq: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  /** Subject that emits when the component has been destroyed. */
  _onDestroy = new Subject<void>();

  constructor(private router: Router, private route: ActivatedRoute, private formBuilder: UntypedFormBuilder, public lhs: LocalStorageService, public sweetAlertService: SweetAlertService, public restService: RestService, public globalAppService: GlobalAppService) { 
    this.paramiD = this.route.snapshot.paramMap.get('id'); // SE recibe el id
    this.paramOID = ConvertParamsBase64Helper(this.paramiD); // Se pasa al html como componete para que reciba el ID
    this.routeBotonUpdateView = this.routeBotonUpdateView + this.paramiD; // Se construye la ruta con lo parametros para el update
  }

  ngOnInit() {
    // Hace el llamado del token
    this.getTokenLS();

    /**
     * Configuración del formulario para el login
     */
    this.rolesForm = this.formBuilder.group({
      nombreRol: new UntypedFormControl('', Validators.compose([
          Validators.required
      ])),
      idRolNivelBusqueda: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      operacionesRol: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      /** Campos para hacer la busqueda en las listas este deben llamarse
       * Como las listas  "nombreLista + Filter"
       */
      listNivelBusqFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
    });

    // listen for search field value changes
    this.rolesForm.controls['listNivelBusqFilter'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBanks('listNivelBusq');
    });

  }

  submitRol() {
    this.router.navigate(['/users/roles-index']);
  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    // Se consulta si el token se envió como input //
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
      this.getRolOperacionesAll( this.authorization );
      // Consulta la lista de nivel de busqueda
      this.getListNivelBusq();
      if ( this.paramOID != 0 ) {
        this.onSearchId(this.paramOID, this.authorization);
      }
    });
  }

  getRolOperacionesAll( val ) {

    // this.sweetAlerparamOIDtService.sweetLoading();
    let params = {
      id: this.paramOID
    };

    this.restService.restGetParams(this.versionApi + 'roles/roles-operaciones/index-all', params, val)
      .subscribe((res) => {
        this.responseServiceOperations = res;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.responseServiceOperations, true, this.redirectionPath).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.modulosRol = this.responseServiceOperations.data.modulos;
            this.operations = this.responseServiceOperations.data.operaciones;
          }
        });
      }, (err) => {
        this.responseServiceOperationsErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.responseServiceOperationsErr, true, this.redirectionPath).then((res) => { });
      }
    );

  }

  // Llama la lista de las regionales
  getListNivelBusq() {

    this.restService.restGet(this.versionApi + 'roles/roles/index-list-nivel-busqueda', this.authorization).subscribe(
      (data) => {
        this.resSerlistNivelBusq = data;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerlistNivelBusq).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.listNivelBusq = this.resSerlistNivelBusq.data;
            // load the list initial
            this.filteredlistNivelBusq.next(this.listNivelBusq.slice());
          }
        });
      }, (err) => {
        this.resSerlistNivelBusqErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerlistNivelBusqErr).then((res) => { });
      }
    );
  }

  /*
  * param - id del rol a buscar
  * param - authori variable de la autorizacion del localstorage
  */
 onSearchId(id, authori ) {
  // this.sweetAlertService.sweetLoading();
  let params = {
    id: this.paramOID,
    isView: true
  };

  this.restService.restGetParams(this.versionApi + 'roles/roles/index-one', params, authori )
    .subscribe((res) => {
      this.responseServiceFormSubmit = res;
      // Evaluar respuesta del servicio
      this.globalAppService.resolveResponse(this.responseServiceFormSubmit, true, this.redirectionPath).then((res) => {
        let responseResolveResponse = res;
        if (responseResolveResponse == true) {
          if( this.responseServiceFormSubmit.data ) {
            for(let name in this.responseServiceFormSubmit.data) {
              if(this.rolesForm.controls[name]) {
                  this.rolesForm.controls[name].setValue(this.responseServiceFormSubmit.data[name]);
              }
            }
          }
        }
      });
    }, (err) => {
      this.responseServiceFormSubmitErr = err;
      // Evaluar respuesta de error del servicio
      this.globalAppService.resolveResponseError(this.responseServiceFormSubmitErr, true, this.redirectionPath).then((res) => { });
    }
  );
}

menuPrimaryReceiveData(event) {
  this.router.navigate(['/' + this.routeBotonUpdateView]);
}

  /**
   * Recibe el nombre de la lista para realizar la busqueda segun el filtro
   * @param nomList nombre lista
   */
  filterBanks(nomList) {
    if (!this[nomList]) {
      return;
    }
    // get the search keyword
    let search = this.rolesForm.controls[nomList + 'Filter'].value;
    if (!search) {
      this['filtered' + nomList].next(this[nomList].slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this['filtered' + nomList].next(
      this[nomList].filter( listOption => listOption.val.toLowerCase().indexOf(search) > -1)
    );
  }

}
