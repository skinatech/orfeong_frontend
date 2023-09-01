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

import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { environment } from 'src/environments/environment';
import { RestService } from 'src/app/services/rest.service';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface ListaBusq {
  id: string;
  val: string;
}

@Component({
  selector: 'app-doc-manag-dependencies-form',
  templateUrl: './doc-manag-dependencies-form.component.html',
  styleUrls: ['./doc-manag-dependencies-form.component.css']
})
export class DocManagDependenciesFormComponent implements OnInit {

  @Output() public submitFormEmit = new EventEmitter<any>();
  // Parametro de operaciones
  @Input() paramOID = 0;
  // Nombre de tarjetas del formulario
  @Input() textForm = 'Formulario principal de dependencias';
  // Iconos del formulario
  @Input() initCardHeaderIcon = 'dns';
  @Input() initCardHeaderIconDatos = 'library_books';
  /** BreadcrumbOn  */
  @Input() breadcrumbOn = [
    { 'name': 'Dependencias', 'route': '/documentManagement/dependencies-index' }
  ];
  @Input() breadcrumbRouteActive = 'Dependencias';
  // Valida typo
  validTextType: boolean = false;

  // Variable del formulario
  moduleForm: UntypedFormGroup;
  // Autentificacion
  authorization: string;
  // Version api
  versionApi = environment.versionApiDefault;
  // Ruta a redirigir
  redirectionPath = '/documentManagement/dependencies-index';
  // Variables de consumo de servicios
  resSerFormSubmit: any;
  resSerFormSubmitErr: any;
  // Variables para el boton flotante
  iconMenu: string = 'save';
  /** Subject that emits when the component has been destroyed. */
  _onDestroy = new Subject<void>();

  /** Variables para llamarlas listas de regionales */
  resSerlistRegional: any;
  resSerlistRegionalErr: any;
  resSerlistDepePadre: any;
  resSerlistDepePadreErr: any;
  resSerGetConfig: any;
  resSerGetConfigErr: any;
  listRegional: any;
  listDepePadre: any;

  maxlengthDependency = 0;

  /** lists filtered + namelist by search keyword */
  filteredlistRegional: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistDepePadre: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);

  constructor(private formBuilder: UntypedFormBuilder, public lhs: LocalStorageService, public restService: RestService,
    public globalAppService: GlobalAppService, public sweetAlertService: SweetAlertService ) {

    /**
     * Configuración del formulario para el login
     */
    this.moduleForm = this.formBuilder.group({
      nombreGdTrdDependencia: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      codigoGdTrdDependencia: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      codigoGdTrdDepePadre: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      idCgRegional: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      /** Campos para hacer la busqueda en las listas este deben llamarse
       * Como las listas  "nombreLista + Filter"
       */
      listRegionalFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      listDepePadreFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
    });
  }

  ngOnInit() {
    // Hace el llamado del token
    this.getTokenLS();
    // listen for search field value changes
    this.moduleForm.controls['listRegionalFilter'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBanks('listRegional');
    });
    // listen for search field value changes
    this.moduleForm.controls['listDepePadreFilter'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBanks('listDepePadre');
    });
  }

  submitForm() {
    if (this.moduleForm.valid) {
      this.submitFormEmit.emit(this.moduleForm.value);
    } else {
      this.sweetAlertService.sweetInfo('Algo está mal', '');
    }
  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;

      /** Llamado de los servicios para las listas */
      this.getListRegional();
      this.getListDependencia();
      this.getConfig();

      if (this.paramOID != 0) {
        this.onSearchId(this.paramOID, this.authorization);
      }
    });
  }

  /*
  * param - id del rol a buscar
  * param - authori variable de la autorizacion del localstorage
  */
  onSearchId(id, authori) {

    // loading Active
    this.sweetAlertService.sweetLoading();
    let params = {
      id: this.paramOID
    };

    this.restService.restGetParams( this.versionApi + 'gestionDocumental/trd-dependencias/index-one', params, authori).subscribe(
      (res) => {
        this.resSerFormSubmit = res;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerFormSubmit, true, this.redirectionPath ).then((res) => {
          let resResolveResponse = res;
          if (resResolveResponse == true) {
            if (this.resSerFormSubmit.data) {
              for (let name in this.resSerFormSubmit.data) {
                if (this.moduleForm.controls[name]) {
                  this.moduleForm.controls[name].setValue(this.resSerFormSubmit.data[name]);
                }
              }
              // code dependencie reandonly
              this.moduleForm.controls['codigoGdTrdDependencia'].disable();
            }
            this.sweetAlertService.sweetClose();
          }
        });
      }, (err) => {
        this.resSerFormSubmitErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerFormSubmitErr, true, this.redirectionPath ).then((res) => { });
      }
    );
  }

  // Llama la lista de las regionales
  getListRegional() {

    this.restService.restGet(this.versionApi + 'configuracionApp/regionales/index-list', this.authorization).subscribe(
      (data) => {
        this.resSerlistRegional = data;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerlistRegional).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.listRegional = this.resSerlistRegional.data;
            // load the list initial
            this.filteredlistRegional.next(this.listRegional.slice());
          }
        });
      }, (err) => {
        this.resSerlistRegionalErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerlistRegionalErr).then((res) => { });
      }
    );
  }

  // Llama la lista de las dependencias
  getListDependencia() {

    this.restService.restGet(this.versionApi + 'gestionDocumental/trd-dependencias/index-list', this.authorization).subscribe(
      (data) => {
        this.resSerlistDepePadre = data;

        // console.log(data);
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerlistDepePadre).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.listDepePadre = this.resSerlistDepePadre.data;
            // load the list initial
            this.filteredlistDepePadre.next(this.listDepePadre.slice());
          }
        });
      }, (err) => {
        this.resSerlistDepePadreErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerlistDepePadreErr).then((res) => { });
      }
    );
  }

  getConfig() {
    this.restService.restGet(this.versionApi + 'gestionDocumental/trd-dependencias/get-config', this.authorization).subscribe(
      (data) => {
        this.resSerGetConfig = data;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerGetConfig).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            this.maxlengthDependency = this.resSerGetConfig.longitudDependencia;
          }
        });
      }, (err) => {
        this.resSerGetConfigErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerGetConfigErr).then((res) => { });
      }
    );
  }

  /** Realiza el filtro de busqueda */
  filterBanks(nomList) {
    if (!this[nomList]) {
      return;
    }
    // get the search keyword
    let search = this.moduleForm.controls[nomList + 'Filter'].value;
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

  /**
   *
   * @param event
   * Cuando se hace clic en el botón se envia el formulario
   */
  menuPrimaryReceiveData(event) {
    let buttonSubmit = <HTMLFormElement>document.getElementById('sendForm');
    buttonSubmit.click();
  }

}
