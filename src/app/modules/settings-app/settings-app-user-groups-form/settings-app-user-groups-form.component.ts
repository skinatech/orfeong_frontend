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
  selector: 'app-settings-app-user-groups-form',
  templateUrl: './settings-app-user-groups-form.component.html',
  styleUrls: ['./settings-app-user-groups-form.component.css']
})
export class SettingsAppUserGroupsFormComponent implements OnInit {

  @Output() public submitFormEmit = new EventEmitter<any>();
  // Parametro de operaciones
  @Input() paramOID = 0;
  // Nombre de tarjetas del formulario
  @Input() textForm = 'Formulario principal de grupo de usuarios';
  // Iconos del formulario
  @Input() initCardHeaderIcon = 'edit_location';
  @Input() initCardHeaderIconDatos = 'library_books';
  // Ruta a redirigir
  redirectionPath = '/setting/user-groups-index';
  /** BreadcrumbOn  */
  @Input() breadcrumbOn = [
    { 'name': 'Configuración', 'route': this.redirectionPath },
  ];
  @Input() breadcrumbRouteActive = 'Grupo de usuarios';
  // Valida typo
  validTextType: boolean = false;

  // Variable del formulario
  moduleForm: UntypedFormGroup;
  // Autentificacion
  authorization: string;
  // Version api
  versionApi = environment.versionApiDefault;
  // Variables de consumo de servicios
  resSerFormSubmit: any;
  resSerFormSubmitErr: any;
  resResolveResponse: any;
  resResolveResponseErr: any;
  resSerlistDepe: any;
  resSerlistDepeErr: any;
  resSerlistUsuer: any;
  resSerlistUsuerErr: any;
  // Variables para el boton flotante
  iconMenu: string = 'save';

  listDepes: any;
  listUsers: any;

  /** lists filtered + namelist by search keyword */
  filteredlistDepes: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistUsers: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);

  /** Subject that emits when the component has been destroyed. */
  _onDestroy = new Subject<void>();

  constructor(private formBuilder: UntypedFormBuilder, public lhs: LocalStorageService, public restService: RestService,
    public globalAppService: GlobalAppService, public sweetAlertService: SweetAlertService ) {

    /**
     * Configuración del formulario
     */
    this.moduleForm = this.formBuilder.group({
      nombreCgGrupoUsuarios: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      idDependencia: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      idUsers: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      /** Campos para hacer la busqueda en las listas este deben llamarse
       * Como las listas  "nombreLista + Filter"
       */
      listDepesFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      listUsersFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
    });

  }

  ngOnInit() {
    // Hace el llamado del token
    this.getTokenLS();
    // listen for search field value changes
    this.moduleForm.controls['listDepesFilter'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBanks('listDepes');
    });
    // listen for search field value changes
    this.moduleForm.controls['listUsersFilter'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBanks('listUsers');
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

      /** Llamado de los servicios para las listas */
      this.getListDependencia();

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

  this.restService.restGetParams( this.versionApi + 'configuracionApp/grupos-usuarios/index-one', params, authori).subscribe(
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
            this.getListUsuarios(this.resSerFormSubmit.data['idDependencia']);
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

// Llama la lista de las dependencias
getListDependencia() {

  this.restService.restGet(this.versionApi + 'gestionDocumental/trd-dependencias/index-list', this.authorization).subscribe(
    (data) => {
      this.resSerlistDepe = data;
      // Evaluar respuesta del servicio
      this.globalAppService.resolveResponse(this.resSerlistDepe).then((res) => {
        let responseResolveResponse = res;
        if (responseResolveResponse == true) {
          this.listDepes = this.resSerlistDepe.data;
          // load the list initial reasing
          this.filteredlistDepes.next(this.listDepes.slice());
        }
      });
    }, (err) => {
      this.resSerlistDepeErr = err;
      // Evaluar respuesta de error del servicio
      this.globalAppService.resolveResponseError(this.resSerlistDepeErr).then((res) => { });
    }
  );
}

// Llama la lista de los usuarios
getListUsuarios( dataDepe ) {

  let params = {
    idDependencia: dataDepe,
  };

  this.restService.restGetParams(this.versionApi + 'user/index-list-by-depe', params, this.authorization).subscribe(
    (data) => {
      this.resSerlistUsuer = data;
      // Evaluar respuesta del servicio
      this.globalAppService.resolveResponse(this.resSerlistUsuer).then((res) => {
        let responseResolveResponse = res;
        if (responseResolveResponse == true) {
          this.listUsers = this.resSerlistUsuer.data;
          // load the list initial
          this.filteredlistUsers.next(this.listUsers.slice());

        }
      });
    }, (err) => {
      this.resSerlistUsuerErr = err;
      // Evaluar respuesta de error del servicio
      this.globalAppService.resolveResponseError(this.resSerlistUsuerErr).then((res) => { });
    }
  );

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
