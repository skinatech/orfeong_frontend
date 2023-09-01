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

import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { environment } from 'src/environments/environment';
import { RestService } from '../../../services/rest.service';
import { GlobalAppService } from '../../../services/global-app.service';

import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface ListaRoles {
  id: string;
  val: string;
}

@Component({
  selector: 'app-users-operations-form',
  templateUrl: './users-operations-form.component.html',
  styleUrls: ['./users-operations-form.component.css']
})
export class UsersOperationsFormComponent implements OnInit {

  @Output()  public submitFormEmit = new EventEmitter<any>();
  // Autentificacion
  authorization: string;
  // Parametro de operaciones
  @Input() paramOID = 0;
  // Nombre del boton
  @Input() textButtonForm = 'Enviar';
  // Nombre del formulario
  @Input() textFormRol = 'Formulario principal de operaciones';
  // Valida nombre rol
  validTextType: boolean = false;
  // Icono del formulario
  @Input() initCardHeaderIcon = 'build';
  /** BreadcrumbOn  */
  @Input() breadcrumbOn = [
    { 'name': 'Administrar operaciones', 'route': '/users/operations-index' }
  ];
  @Input() breadcrumbRouteActive = 'Operaciones';

  /** Subject that emits when the component has been destroyed. */
  _onDestroy = new Subject<void>();

  /** list of banks filtered by search keyword */
  filteredBanks: ReplaySubject<ListaRoles[]> = new ReplaySubject<ListaRoles[]>(1);

  /**
   * Configuraciones para los servicios
   */
  responseServiceFormSubmit: any;
  responseServiceFormSubmitErr: any;
  responseServiceListModule: any;
  responseServiceListModuleErr: any;
  listModuleMenu: any;

  moduleForm: UntypedFormGroup;
  /** Boton flotante */
  iconMenu: string = 'save';

  constructor( private formBuilder: UntypedFormBuilder, public lhs: LocalStorageService, public sweetAlertService: SweetAlertService, public restService: RestService, public globalAppService: GlobalAppService) { }

  ngOnInit() {
    window.scroll(0, 0); // Posicionando scroll al inicio
    // Hace el llamado del token
    this.getTokenLS();

    /**
     * Configuración del formulario para el login
     */
    this.moduleForm = this.formBuilder.group({
      nombreRolOperacion: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      aliasRolOperacion: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      moduloRolOperacion: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      idRolModuloOperacion: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      bankFilterCtrl: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
    });

    // listen for search field value changes
    this.moduleForm.controls['bankFilterCtrl'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks();
      });

  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    // Se consulta si el token se envió como input //
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
      this.getListmodules( this.authorization );
    });
  }

  submitRol() {
    // console.log(this.moduleForm.value);
    if (this.moduleForm.valid) {
      this.submitFormEmit.emit(this.moduleForm.value);
    } else {
      this.sweetAlertService.sweetInfo('Algo está mal', '');
    }
  }

  /*
  * param - authori variable de la autorizacion del localstorage
  */
  getListmodules( authori ) {
    this.sweetAlertService.sweetLoading();
    let versionApi = environment.versionApiDefault;

    this.restService.restGet(versionApi + 'roles/roles-modulos-operaciones/index', authori )
      .subscribe((res) => {
        this.responseServiceListModule = res;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.responseServiceListModule, true, '/users/operations-index').then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            if ( this.responseServiceListModule.data ) {
              this.listModuleMenu = this.responseServiceListModule.data;

              // load the initial bank list
              this.filteredBanks.next(this.listModuleMenu.slice());

              this.sweetAlertService.sweetClose();
              if ( this.paramOID != 0 ) {
                this.onSearchId(this.paramOID, this.authorization);
              }
            }
          }
        });
      }, (err) => {
        this.responseServiceListModuleErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.responseServiceListModuleErr, true, '/users/operations-index').then((res) => { });
      }
    );
  }

  /*
  * param - id del rol a buscar
  * param - authori variable de la autorizacion del localstorage
  */
  onSearchId(id, authori ) {
    // this.sweetAlertService.sweetLoading();
    let versionApi = environment.versionApiDefault;
    let params = {
      id: this.paramOID
    };

    this.restService.restGetParams(versionApi + 'roles/roles-operaciones/index-one', params, authori )
      .subscribe((res) => {
        this.responseServiceFormSubmit = res;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.responseServiceFormSubmit, true, '/users/operations-index').then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            if ( this.responseServiceFormSubmit.data ) {
              for (let name in this.responseServiceFormSubmit.data) {
                if (this.moduleForm.controls[name]) {
                    this.moduleForm.controls[name].setValue(this.responseServiceFormSubmit.data[name]);
                }
                if (name == 'idRolModuloOperacion') {
                  let toSelect = this.listModuleMenu.find(c => c.id == this.responseServiceFormSubmit.data[name] );
                  this.moduleForm.controls[name].setValue( toSelect );
                }
              }
            }
          }
        });
      }, (err) => {
        this.responseServiceFormSubmitErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.responseServiceFormSubmitErr, true, '/users/operations-index').then((res) => { });
      }
    );
  }

  filterBanks() {
    if (!this.listModuleMenu) {
      return;
    }
    // get the search keyword
    let search = this.moduleForm.controls['bankFilterCtrl'].value;
    if (!search) {
      this.filteredBanks.next(this.listModuleMenu.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredBanks.next(
      this.listModuleMenu.filter( listModuleMenu => listModuleMenu.val.toLowerCase().indexOf(search) > -1)
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

}
