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
import { AuthService } from 'src/app/services/auth.service';

import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface ListaBusq {
  id: string;
  val: string;
}

@Component({
  selector: 'app-settings-app-provides-external-form',
  templateUrl: './settings-app-provides-external-form.component.html',
  styleUrls: ['./settings-app-provides-external-form.component.css']
})
export class SettingsAppProvidesExternalFormComponent implements OnInit {

  @Output() public submitFormEmit = new EventEmitter<any>();
  // Parametro de operaciones
  @Input() paramOID = 0;
  // Nombre de tarjetas del formulario
  @Input() textForm = 'Formulario principal de usuarios interoperabilidad';
  // Iconos del formulario
  @Input() initCardHeaderIcon = 'local_shipping';
  @Input() initCardHeaderIconDatos = 'library_books';
  /** BreadcrumbOn  */
  @Input() breadcrumbOn = [
    { 'name': 'Configuración', 'route': '/setting/providers-external-index' },
  ];
  @Input() breadcrumbRouteActive = 'Usuarios interoperabilidad';
  // Valida typo
  validTextType: boolean = false;

  // Variable del formulario
  moduleForm: UntypedFormGroup;
  resResolveResponse: any;
  resResolveResponseErr: any;
  resSerlistRegional: any;
  resSerlistRegionalErr: any;
  resSerlistServicios: any;
  resSerlistServiciosErr: any;

  // Autentificacion
  authorization: string;
  // Version api
  versionApi = environment.versionApiDefault;
  // Ruta a redirigir
  redirectionPath = '/setting/providers-external-index';
  // Variables de consumo de servicios
  resSerFormSubmit: any;
  resSerFormSubmitErr: any;
  // Variables para el boton flotante
  iconMenu: string = 'save';
  /** Variables para llamarlas listas de dependencias */
  responseServicelistDependencias: any;
  responseServicelistDependenciasErr: any;
  listDependencias: any;
  filteredlistDependencias: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  _onDestroy = new Subject<void>();

  /** Variables para llamarlas listas de tipos de identificacion */
  responseServicelistTipIdens: any;
  responseServicelistTipIdensErr: any;
  listTipIdens: any;
  filteredlistTipIdens: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);

  constructor(private formBuilder: UntypedFormBuilder, public lhs: LocalStorageService, public restService: RestService,
    public globalAppService: GlobalAppService, public sweetAlertService: SweetAlertService, private authService: AuthService ) {

    /**
     * Configuración del formulario
     */
    this.moduleForm = this.formBuilder.group({
      nombreCgProveedorExterno: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      email: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.email
      ])),
      idGdTrdDependencia: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      documento: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      idTipoIdentificacion: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      listDependenciasFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      listTipIdensFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
    });

  }

  ngOnInit() {
     // Hace el llamado del token
     this.getTokenLS();

     // listen for search field value changes
    this.moduleForm.controls['listDependenciasFilter'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBanks('listDependencias');
    });

    this.moduleForm.controls['listTipIdensFilter'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBanks('listTipIdens');
    });
  }

  submitForm() {
    if (this.moduleForm.valid) {
      // console.log( this.moduleForm.value );
      this.submitFormEmit.emit(this.moduleForm.value);
    } else {
      this.sweetAlertService.sweetInfo('Algo está mal', '');
    }
  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;

      this.getDependencias();
      this.getListidentifi();

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

  this.restService.restGetParams( this.versionApi + 'configuracionApp/cg-proveedores-externos/index-one', params, authori).subscribe(
    (res) => {
      this.resSerFormSubmit = res;
      // console.log( this.resSerFormSubmit );
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

getDependencias() {
  let versionApi = environment.versionApiDefault;
  this.restService.restGet(versionApi + 'gestionDocumental/trd-dependencias/index-list', this.authorization).subscribe(
    (data) => {
      this.responseServicelistDependencias = data;
      // Evaluar respuesta del servicio
      this.globalAppService.resolveResponse(this.responseServicelistDependencias).then((res) => {
        let responseResolveResponse = res;
        if (responseResolveResponse == true) {
          this.listDependencias = this.responseServicelistDependencias.data;
          // load the initial list
          this.filteredlistDependencias.next(this.listDependencias.slice());
        }
      });
    }, (err) => {
      this.responseServicelistDependenciasErr = err;
      // Evaluar respuesta de error del servicio
      this.globalAppService.resolveResponseError(this.responseServicelistDependenciasErr).then((res) => { });
    }
  );

}

getListidentifi() {
  let versionApi = environment.versionApiDefault;
  this.authService.authGet(versionApi + 'site/id-type-index').subscribe(
    (data) => {
      this.responseServicelistTipIdens = data;
      // Evaluar respuesta del servicio
      this.globalAppService.resolveResponse(this.responseServicelistTipIdens).then((res) => {
        let responseResolveResponse = res;
        if (responseResolveResponse == true) {
          this.listTipIdens = this.responseServicelistTipIdens.data;
          // load the initial list
          this.filteredlistTipIdens.next(this.listTipIdens.slice());
        }
      });
    }, (err) => {
      this.responseServicelistTipIdensErr = err;
      // Evaluar respuesta de error del servicio
      this.globalAppService.resolveResponseError(this.responseServicelistTipIdensErr).then((res) => { });
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
