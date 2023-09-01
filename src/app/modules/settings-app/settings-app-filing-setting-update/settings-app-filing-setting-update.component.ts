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

import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { RestService } from 'src/app/services/rest.service';
import { GlobalAppService } from 'src/app/services/global-app.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
// import list
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface ListaBusq {
  id: string;
  val: string;
}

@Component({
  selector: 'app-settings-app-filing-setting-update',
  templateUrl: './settings-app-filing-setting-update.component.html',
  styleUrls: ['./settings-app-filing-setting-update.component.css']
})
export class SettingsAppFilingSettingUpdateComponent implements OnInit {

  // Nombre de tarjetas del formulario
  @Input() textForm = 'Configuración del radicado';
  // Iconos del formulario
  @Input() initCardHeaderIcon = 'settings_applications';
  @Input() initCardHeaderIconDatos = 'library_books';
  /** BreadcrumbOn  */
  @Input() breadcrumbOn = [
    { 'name': 'Configuración', 'route': '/setting' },
  ];
  @Input() breadcrumbRouteActive = 'Configuración del radicado';
  // Variables para el boton flotante
  iconMenu: string = 'save';
  // Valida
  validTextType: boolean = false;
  // Autentificacion
  authorization: string;
  // Version api
  versionApi = environment.versionApiDefault;
  // Ruta a redirigir
  redirectionPath = '/dashboard';
  // Variables de consumo de servicios
  resSerFormSubmit: any;
  resSerFormSubmitErr: any;
  resSerSearch: any;
  resSerSearchErr: any;
  // Variable del formulario
  moduleForm: UntypedFormGroup;
  listEstructura: any;

  /** lists filtered + namelist by search keyword */
  filteredlistEstructura: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);

  /** Subject that emits when the component has been destroyed. */
  _onDestroy = new Subject<void>();

  constructor(private formBuilder: UntypedFormBuilder, public lhs: LocalStorageService, public sweetAlertService: SweetAlertService, public restService: RestService,
    public globalAppService: GlobalAppService) {
    /**
     * Configuración del formulario
     */
    this.moduleForm = this.formBuilder.group({
      id: new UntypedFormControl('', Validators.compose([
        // Validators.required,
      ])),
      longitudDependenciaCgNumeroRadicado: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.pattern("^[1-9]*$")
      ])),
      estructuraCgNumeroRadicado: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      longitudConsecutivoCgNumeroRadicado: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.pattern("^[1-9]*$")
      ])),
      /** Campos para hacer la busqueda en las listas este deben llamarse
       * Como las listas  "nombreLista + Filter"
       */
      listEstructuraFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
    });
  }

  ngOnInit() {
    // Hace el llamado del token
    this.getTokenLS();
    // listen for search field value changes
    this.moduleForm.controls['listEstructuraFilter'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBanks('listEstructura');
    });
  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;

      this.onSearchId(this.authorization);
    });
  }

  submitForm() {
    if (!this.moduleForm.valid) {
      // console.log( this.moduleForm.value );
      this.sweetAlertService.sweetInfo('Algo está mal', '');
    } else {

      // Cargando true
      this.sweetAlertService.sweetLoading();

      this.restService.restPut( this.versionApi + 'configuracionApp/numero-radicado/update', this.moduleForm.value, this.authorization)
        .subscribe((res) => {
          this.resSerFormSubmit = res;

          // Evaluar respuesta del servicio
          this.globalAppService.resolveResponse(this.resSerFormSubmit, false).then((res) => {
            let responseResolveResponse = res;
            if (responseResolveResponse == true) {
              // Muestra el mensaje
              this.sweetAlertService.showNotification('success', this.resSerFormSubmit.message);
            }
            // Cargando false
            this.sweetAlertService.sweetClose();
          });
      }, (err) => {
          this.resSerFormSubmitErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resSerFormSubmitErr, false ).then((res) => { });
      });
    }
  }

  /*
  * param - id del rol a buscar
  * param - authori variable de la autorizacion del localstorage
  */
  onSearchId(authori) {

    // loading Active
    this.sweetAlertService.sweetLoading();

    this.restService.restGet( this.versionApi + 'configuracionApp/numero-radicado/index-one', authori).subscribe(
      (res) => {
        this.resSerSearch = res;
        // console.log( this.resSerSearch );
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerSearch, true, this.redirectionPath ).then((res) => {
          let resResolveResponse = res;
          if (resResolveResponse == true) {
            if (this.resSerSearch.data) {
              for (let name in this.resSerSearch.data) {
                if (this.moduleForm.controls[name]) {
                  this.moduleForm.controls[name].setValue(this.resSerSearch.data[name]);
                }
              }
            }
            // Asigna el valor a las listas
            if (this.resSerSearch.dataList) {
              this.listEstructura = this.resSerSearch.dataList;
              // load the list initial
              this.filteredlistEstructura.next(this.listEstructura.slice());
            }
            this.sweetAlertService.sweetClose();
          }
        });
      }, (err) => {
        this.resSerSearchErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerSearchErr, true, this.redirectionPath ).then((res) => { });
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
