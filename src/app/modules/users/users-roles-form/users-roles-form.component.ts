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

import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { environment } from 'src/environments/environment';
import { RestService } from 'src/app/services/rest.service';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivateTranslateService } from 'src/app/services/activate-translate.service';

// Lista de busqueda
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface ListaBusq {
  id: string;
  val: string;
}
@Component({
  selector: 'app-users-roles-form',
  templateUrl: './users-roles-form.component.html',
  styleUrls: ['./users-roles-form.component.css']
})
export class UsersRolesFormComponent implements OnInit, OnDestroy {

  @Output() public submitFormEmit = new EventEmitter<any>();
  // Autentificacion
  authorization: string;
  // Parametro de operaciones
  @Input() paramOID = 0;
  // Nombre del boton
  @Input() textButtonForm = 'Enviar';
  // Nombre del formulario
  @Input() textFormRol = 'Formulario principal Rol';
  // Valida nombre rol
  validTextType: boolean = false;
  // Icono del formulario
  @Input() initCardHeaderIcon = 'people';
  /** BreadcrumbOn  */
  @Input() breadcrumbOn = [
    { 'name': 'Gestión de usuarios', 'route': '/users' }
  ];
  @Input() breadcrumbRouteActive = 'Administrar perfiles';
  versionApi = environment.versionApiDefault;
  orfeoNgExpressVal = environment.orfeoNgExpress.ocultarModulos;
  
  /**
   * Configuraciones para los servicios
   */
  responseServiceFormSubmit: any;
  responseServiceFormSubmitErr: any;
  responseServiceOperaciones: any;
  responseServiceOperacionesErr: any;
  resSerlistNivelBusq: any;
  resSerlistNivelBusqErr: any;
  rolesForm: UntypedFormGroup;
  type: UntypedFormGroup;
  modulosRol: any;
  operations: any;
  dataOperationsTrue: Array<any> = [];
  /** Boton flotante */
  iconMenu: string = 'save';

  msgSelectMinPermiso = {
    'es': 'El perfil debe tener al menos un acceso habilitado',
    'en': 'The profile must have at least one access enabled',
    'br': 'O perfil deve ter pelo menos um acesso ativado',
  };

  listNivelBusq: any;

  /** lists filtered + namelist by search keyword */
  filteredlistNivelBusq: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);

  /** Variables de internacionalización */
  activeLang: string;
  languageReceive: any;
  subscriptionTranslateService$: Subscription;

  /** Subject that emits when the component has been destroyed. */
  _onDestroy = new Subject<void>();

  constructor( private formBuilder: UntypedFormBuilder, public lhs: LocalStorageService, public sweetAlertService: SweetAlertService, public restService: RestService, public globalAppService: GlobalAppService, private translate: TranslateService, private activateTranslateService: ActivateTranslateService) {
    this.detectLanguageInitial();
  }

  ngOnInit() {
    window.scroll(0, 0); // Posicionando scroll al inicio
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
    this.detectLanguageChange();
    // listen for search field value changes
    this.rolesForm.controls['listNivelBusqFilter'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBanks('listNivelBusq');
    });
  }

  submitRol() {

    this.dataOperationsTrue.length = 0; // Limpio el array que contiene los ids de las operaciones
    this.toAssignOperatios(); // Se Corre el metodo que contiene la asiganación de ids de las operaciones
    this.rolesForm.controls['operacionesRol'].setValue(this.dataOperationsTrue); // Se pasa el array de ids al campo del formulario

    if (this.rolesForm.valid) {
      if (this.dataOperationsTrue.length === 0) {
        this.sweetAlertService.sweetInfo(this.msgSelectMinPermiso[this.activeLang], '');
      } else {
        this.submitFormEmit.emit(this.rolesForm.value);
      }
    } else {
      this.sweetAlertService.sweetInfo('Algo está mal', '');
    }

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
        this.responseServiceOperaciones = res;
        //console.log( this.responseServiceOperaciones );
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.responseServiceOperaciones, true, '/users/roles-index').then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.modulosRol = this.responseServiceOperaciones.data.modulos;
            this.operations = this.responseServiceOperaciones.data.operaciones;
          }
        });
      }, (err) => {
        this.responseServiceOperacionesErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.responseServiceOperacionesErr, true, '/users/roles-index').then((res) => { });
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

  /** Metodo para asignar los ids de las operaciones a un array y ese array pasarlo al formulario en el campo operacionesRol */
  toAssignOperatios() {
    this.modulosRol.forEach(modules => {
        this.operations[modules.name].forEach(operations => {
            if (operations.value == true) {
                this.dataOperationsTrue.push(operations.id);
            }
        });
    });
  }

  validateInputParent(e) {
    this.modulosRol.forEach(modules => {
      // console.log(modules);
        if (modules.name == e.target.value) {
            modules.value = e.target.checked;
        }
    });

    this.operations[e.target.value].forEach(modules => {
        modules.value = e.target.checked;
    });
  }

  validateInputChildren(e) {
    this.operations[e.target.name].forEach(operations => {
        if (operations.id == e.target.value) {
            operations.value = e.target.checked;
        }
    });

    if (e.target.checked) {
        let countModuleOperation = this.operations[e.target.name].length;
        this.operations[e.target.name].forEach(operations => {
            if (operations.value == e.target.checked) {
                countModuleOperation = countModuleOperation - 1;
            }
        });

        if (countModuleOperation == 0) {
            this.modulosRol.forEach(modules => {
                if (modules.name == e.target.name) {
                    modules.value = true;
                }
            });
        }

    } else {
        this.modulosRol.forEach(modules => {
            if (modules.name == e.target.name) {
                modules.value = false;
            }
        });
    }
  }

  /*
  * param - id del rol a buscar
  * param - authori variable de la autorizacion del localstorage
  */
  onSearchId(id, authori ) {
    // this.sweetAlertService.sweetLoading();
    let params = {
      id: this.paramOID
    };

    this.restService.restGetParams(this.versionApi + 'roles/roles/index-one', params, authori )
      .subscribe((res) => {
        this.responseServiceFormSubmit = res;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.responseServiceFormSubmit, true, '/users/roles-index').then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            if ( this.responseServiceFormSubmit.data ) {
              for (let name in this.responseServiceFormSubmit.data) {
                if (this.rolesForm.controls[name]) {
                    this.rolesForm.controls[name].setValue(this.responseServiceFormSubmit.data[name]);
                }
              }
            }
          }
        });
      }, (err) => {
        this.responseServiceFormSubmitErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.responseServiceFormSubmitErr, true, '/users/roles-index').then((res) => { });
      }
    );
  }

  /**
   *
   * @param event
   * Cuando se hace clic en el botón se envia el formulario
   */
  menuPrimaryReceiveData(event) {
    var buttonSubmit = <HTMLFormElement>document.getElementById('sendForm');
    buttonSubmit.click();
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

  /** Método para detectar el idioma de la aplicación */
  detectLanguageInitial() {
    if (localStorage.getItem('language')) {
      this.activeLang = localStorage.getItem('language');
    } else {
      this.activeLang = 'es';
    }
    this.translate.setDefaultLang(this.activeLang);
  }

  detectLanguageChange() {
    this.activateTranslateService.activateLanguageChange.subscribe(language => {
      this.languageReceive = language;
      this.translate.setDefaultLang(this.languageReceive);
      this.activeLang = this.languageReceive;
    });
  }
  /** Fin Métodos para el uso de la internacionalización */

  ngOnDestroy() {
    if (!!this.subscriptionTranslateService$) this.subscriptionTranslateService$.unsubscribe();
  }

}
