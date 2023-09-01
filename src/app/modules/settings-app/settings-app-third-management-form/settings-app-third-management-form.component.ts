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
import { ThemePalette} from '@angular/material/core';

import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface ListaBusq {
  id: string;
  val: string;
}

@Component({
  selector: 'app-settings-app-third-management-form',
  templateUrl: './settings-app-third-management-form.component.html',
  styleUrls: ['./settings-app-third-management-form.component.css']
})
export class SettingsAppThirdManagementFormComponent implements OnInit {

  @Output() public submitFormEmit = new EventEmitter<any>();
  // Parametro de operaciones
  @Input() paramOID = 0;
  // Nombre de tarjetas del formulario
  @Input() textForm = 'Formulario principal de tercero';
  // Iconos del formulario
  @Input() initCardHeaderIcon = 'person_search';
  @Input() initCardHeaderIconDatos = 'library_books';
  // Ruta a redirigir
  redirectionPath = '/setting/third-management-index';
  /** BreadcrumbOn  */
  @Input() breadcrumbOn = [
    { 'name': 'Configuración', 'route': this.redirectionPath },
  ];
  @Input() breadcrumbRouteActive = 'Terceros';
  // Valida typo
  validTextType: boolean = false;
  // Muestra mensaje de información
  @Input() statusAlert: boolean = false;
  // Muestra el campo de caracterización
  @Input() statusFieldCaracterization: boolean = false;

  // Variable del formulario
  moduleForm: UntypedFormGroup;
  resResolveResponse: any;
  resResolveResponseErr: any;
  resSerNivelGeografico1: any;
  resSerNivelGeografico1Err: any;
  resSerNivelGeografico2: any;
  resSerNivelGeografico2Err: any;
  resSerNivelGeografico3: any;
  resSerNivelGeografico3Err: any;

  // Autentificacion
  authorization: string;
  // Version api
  versionApi = environment.versionApiDefault;
  // Variables de consumo de servicios
  resSerFormSubmit: any;
  resSerFormSubmitErr: any;
  resServicesVerificarDocNit: any;
  resServicesVerificarDocNitErr: any;
  resServicesVerificarCorreo: any;
  resServicesVerificarCorreoErr: any;
  resSerlistGeneralPQRS: any;
  resSerlistGeneralPQRSErr: any;
  // Variables para el boton flotante
  iconMenu: string = 'save';
  /** slide-toggle  */
  color: ThemePalette = 'primary';
  messageIsNuevoRemitente: string = 'No';
  showFormCaracterizacion = false; // muestra el formulario de caracterización

  /** Nivel Geografico  */
  listNivelGeografico1: any; // Pais
  listNivelGeografico2: any; // Departamento
  listNivelGeografico3: any; // Municipio
  listTipoPersona: any;  // Tipo de persona
  listGenero: any;              // Genero
  listRangoEdad: any;           // Rango de edad
  listVulnerabilidad: any;      // Vulnerabilidad
  listEtnia: any;               // Etnia

  /** lists filtered + namelist by search keyword */
  filteredlistNivelGeografico1: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistNivelGeografico2: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistNivelGeografico3: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistTipoPersona: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistGenero: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistRangoEdad: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistVulnerabilidad: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistEtnia: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistTipoClasi: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);

  /** Subject that emits when the component has been destroyed. */
  _onDestroy = new Subject<void>();

  constructor(private formBuilder: UntypedFormBuilder, public lhs: LocalStorageService, public restService: RestService,
    public globalAppService: GlobalAppService, public sweetAlertService: SweetAlertService ) {

    /**
     * Configuración del formulario
     */
    this.moduleForm = this.formBuilder.group({
      nombreCliente: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      idTipoPersona: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      numeroDocumentoCliente: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      direccionCliente: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      idNivelGeografico1: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      idNivelGeografico2: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      idNivelGeografico3: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      correoElectronicoCliente: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      telefonoCliente: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      generoClienteCiudadanoDetalle: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      rangoEdadClienteCiudadanoDetalle: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      vulnerabilidadClienteCiudadanoDetalle: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      etniaClienteCiudadanoDetalle: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      caracterizacion: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      /** Campos para hacer la busqueda en las listas este deben llamarse
       * Como las listas  "nombreLista + Filter"
       */
      listNivelGeografico1Filter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      listNivelGeografico2Filter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      listNivelGeografico3Filter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      listTipoPersonaFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      listGeneroFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      listRangoEdadFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      listVulnerabilidadFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      listEtniaFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),

    });

  }

  ngOnInit() {
    // Hace el llamado del token
    this.getTokenLS();
    // Nivel geografico 1 - Pais
    this.moduleForm.controls['listNivelGeografico1Filter'].valueChanges.pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBanks('listNivelGeografico1');
    });
    // Nivel geografico 2 - Departamento
    this.moduleForm.controls['listNivelGeografico2Filter'].valueChanges.pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBanks('listNivelGeografico2');
    });
    // Nivel geografico 3 - Municipio
    this.moduleForm.controls['listNivelGeografico3Filter'].valueChanges.pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBanks('listNivelGeografico3');
    });
    // Tipo de persona
    this.moduleForm.controls['listTipoPersonaFilter'].valueChanges.pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBanks('listTipoPersona');
    });

    /** Start Caracterización */
    if (this.showFormCaracterizacion) {
      // Lista Genero
      this.moduleForm.controls['listGeneroFilter'].valueChanges.pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks('listGenero');
      });
      // Lista Rango de edad
      this.moduleForm.controls['listRangoEdadFilter'].valueChanges.pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks('listRangoEdad');
      });
      // Lista Vulnerabilidad
      this.moduleForm.controls['listVulnerabilidadFilter'].valueChanges.pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks('listVulnerabilidad');
      });
      // Lista Etnia
      this.moduleForm.controls['listEtniaFilter'].valueChanges.pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks('listEtnia');
      });

      this.moduleForm.controls['generoClienteCiudadanoDetalle'].setValidators([Validators.required]);
      this.moduleForm.controls['rangoEdadClienteCiudadanoDetalle'].setValidators([Validators.required]);
      this.moduleForm.controls['vulnerabilidadClienteCiudadanoDetalle'].setValidators([Validators.required]);
      this.moduleForm.controls['etniaClienteCiudadanoDetalle'].setValidators([Validators.required]);

    }
    /** End Caracterización */
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
      this.nivelGeografico1();
      this.setFieldsNewPQRSD();

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

    this.restService.restGetParams( this.versionApi + 'configuracionApp/cg-gestion-terceros/index-one', params, authori).subscribe(
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
                // Hace llamado a Departamentos
                if ( name == 'idNivelGeografico1' ) {
                  this.nivelGeografico2(this.resSerFormSubmit.data[name]);
                }
                // Hace llamado a Municipios
                if ( name == 'idNivelGeografico2' ) {
                  this.nivelGeografico3(this.resSerFormSubmit.data[name]);
                }
                if ( name == 'caracterizacion' ) {
                  this.showFormCaracterizacion = true;
                  this.moduleForm.controls['correoElectronicoCliente'].setValidators([Validators.required]);
                  this.moduleForm.controls['correoElectronicoCliente'].updateValueAndValidity();
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

  /**
   * Funcion que consulta el nivel geografico segun el paíz muestra el departamento
   */
  nivelGeografico1() {

    this.restService.restGet(this.versionApi + 'radicacion/radicados/nivel-geografico1', this.authorization).subscribe((res) => {

      this.resSerNivelGeografico1 = res;

          // lista Municipios
          if (this.resSerNivelGeografico1.dataNivelGeografico1 ) {
            this.listNivelGeografico1 = this.resSerNivelGeografico1.dataNivelGeografico1;
            // load the list initial
            this.filteredlistNivelGeografico1.next(this.listNivelGeografico1.slice());
          }

      }, (err) => {
        this.resSerNivelGeografico1Err = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerNivelGeografico1Err).then((res) => { });
      }
    );
  }

  /**
   * Funcion que consulta el nivel geografico segun el departamento muestra los municipios
   * @param nivel1 nivel geografico 1
   */
  nivelGeografico2(nivel1) {

    let params = {
      // idNivelGeografico1: this.moduleForm.controls['idNivelGeografico1'].value
      idNivelGeografico1: nivel1
    };

    this.restService.restPost(this.versionApi + 'radicacion/radicados/nivel-geografico2', params, this.authorization).subscribe((res) => {

      this.resSerNivelGeografico2 = res;

          // lista Municipios
          if (this.resSerNivelGeografico2.dataNivelGeografico2 ) {
            this.listNivelGeografico2 = this.resSerNivelGeografico2.dataNivelGeografico2;
            // load the list initial
            this.filteredlistNivelGeografico2.next(this.listNivelGeografico2.slice());
          }

      }, (err) => {
        this.resSerNivelGeografico2Err = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerNivelGeografico2Err).then((res) => { });
      }
    );
  }

  /**
   * Funcion que consulta el nivel geografico segun el departamento muestra los municipios
   * @param nivel2 nivel geografico 2
   */
  nivelGeografico3(nivel2) {

    let params = {
      idNivelGeografico2: nivel2
    };

    this.restService.restPost(this.versionApi + 'radicacion/radicados/nivel-geografico3', params, this.authorization).subscribe((res) => {

      this.resSerNivelGeografico3 = res;

      // lista Departamentos
      if (this.resSerNivelGeografico3.dataNivelGeografico3 ) {
        this.listNivelGeografico3 = this.resSerNivelGeografico3.dataNivelGeografico3;
        // load the list initial
        this.filteredlistNivelGeografico3.next(this.listNivelGeografico3.slice());
      }

    }, (err) => {
      this.resSerNivelGeografico3Err = err;
      // Evaluar respuesta de error del servicio
      this.globalAppService.resolveResponseError(this.resSerNivelGeografico3Err).then((res) => { });
    });

  }

  /**
   * Fiuncion para validar el número de documento
   */
  verificarDocNit() {

    let params = {
      numeroDocumentoCliente: this.moduleForm.controls['numeroDocumentoCliente'].value
    };

    this.restService.restPost(this.versionApi + 'radicacion/radicados/verificar-identificacion-cliente', params, this.authorization).subscribe((res) => {
      this.resServicesVerificarDocNit = res;

        if (this.resServicesVerificarDocNit.data['available'] == false) {
            this.moduleForm.controls['numeroDocumentoCliente'].setValue('');
            this.sweetAlertService.showNotification( 'danger', this.resServicesVerificarDocNit['message'], 6000);
        }

      }, (err) => {
        this.resServicesVerificarDocNitErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resServicesVerificarDocNitErr).then((res) => { });
      }
    );

  }

  /**
   * Fiuncion para validar el correo electronico
   */
  verificarCorreo() {

    let params = {
      correoElectronicoCliente: this.moduleForm.controls['correoElectronicoCliente'].value
    };

    this.restService.restPost(this.versionApi + 'radicacion/radicados/verificar-correo-cliente', params, this.authorization).subscribe((res) => {

      this.resServicesVerificarCorreo = res;

          if (this.resServicesVerificarCorreo.data['available'] == false) {
              this.moduleForm.controls['correoElectronicoCliente'].setValue(this.resServicesVerificarCorreo.data['correoElectronicoCliente']);
              this.sweetAlertService.showNotification( 'danger', this.resServicesVerificarCorreo['message'], 6000);
          }

      }, (err) => {
        this.resServicesVerificarCorreoErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resServicesVerificarCorreoErr).then((res) => { });
      }
    );

  }

  /**
   * Funcion que muestra los campos adicionales para un radicado que tiene un remitente nuevo y es tipo PQRSD
   */
  setFieldsNewPQRSD() {

      // Verifica si al menos en la lista genero tiene valores
      if ( !this.listGenero ) {
        this.restService.restGet(this.versionApi + 'radicacion/radicados/ciudadano-list', this.authorization).subscribe(
          (data) => {
            this.resSerlistGeneralPQRS = data;
            // console.log(this.resSerlistGeneralPQRS);
            // Evaluar respuesta del servicio
            this.globalAppService.resolveResponse(this.resSerlistGeneralPQRS).then((res) => {
              let responseResolveResponse = res;
              if (responseResolveResponse == true) {

                // lista Etnia
                if (this.resSerlistGeneralPQRS.dataEtnia ) {
                  this.listEtnia = this.resSerlistGeneralPQRS.dataEtnia;
                  // load the list initial
                  this.filteredlistEtnia.next(this.listEtnia.slice());
                }
                // lista Gemero
                if (this.resSerlistGeneralPQRS.dataGenero ) {
                  this.listGenero = this.resSerlistGeneralPQRS.dataGenero;
                  // load the list initial
                  this.filteredlistGenero.next(this.listGenero.slice());
                }
                // lista Rango de edad
                if (this.resSerlistGeneralPQRS.dataRangoEdad ) {
                  this.listRangoEdad = this.resSerlistGeneralPQRS.dataRangoEdad;
                  // load the list initial
                  this.filteredlistRangoEdad.next(this.listRangoEdad.slice());
                }
                // lista Vulnerabilidad
                if (this.resSerlistGeneralPQRS.dataVulnerabilidad ) {
                  this.listVulnerabilidad = this.resSerlistGeneralPQRS.dataVulnerabilidad;
                  // load the list initial
                  this.filteredlistVulnerabilidad.next(this.listVulnerabilidad.slice());
                }
                // lista tipo persona
                if (this.resSerlistGeneralPQRS.dataTipoPersona ) {
                  this.listTipoPersona = this.resSerlistGeneralPQRS.dataTipoPersona;
                  // load the list initial
                  this.filteredlistTipoPersona.next(this.listTipoPersona.slice());
                }
              }
            });
          }, (err) => {
            this.resSerlistGeneralPQRSErr = err;
            // Evaluar respuesta de error del servicio
            this.globalAppService.resolveResponseError(this.resSerlistGeneralPQRSErr).then((res) => { });
          });
      }

  }

  /**
   * Funcion que oculta o muestra el formulario de caracterización
   * @param event
   */
  MatSlideToggleChange(event) {

    if (event.checked) {
      this.messageIsNuevoRemitente = 'Si';
      this.showFormCaracterizacion = true;
      // Verifica que no se ejecute dos veces

      this.moduleForm.controls['correoElectronicoCliente'].setValidators([Validators.required]);
      this.moduleForm.controls['correoElectronicoCliente'].updateValueAndValidity();

      if ( this.listGenero.length <= 0 ) {
        this.setFieldsNewPQRSD();
      }
    } else {
      this.showFormCaracterizacion = false;
      this.messageIsNuevoRemitente = 'No';
      // Limpia los valores
      this.moduleForm.controls['generoClienteCiudadanoDetalle'].setValue('');
      this.moduleForm.controls['rangoEdadClienteCiudadanoDetalle'].setValue('');
      this.moduleForm.controls['vulnerabilidadClienteCiudadanoDetalle'].setValue('');
      this.moduleForm.controls['etniaClienteCiudadanoDetalle'].setValue('');
      // Quita validacion de que sea requerido
      this.moduleForm.controls['generoClienteCiudadanoDetalle'].setValidators( []);
      this.moduleForm.controls['generoClienteCiudadanoDetalle'].updateValueAndValidity();
      this.moduleForm.controls['rangoEdadClienteCiudadanoDetalle'].setValidators( []);
      this.moduleForm.controls['rangoEdadClienteCiudadanoDetalle'].updateValueAndValidity();
      this.moduleForm.controls['vulnerabilidadClienteCiudadanoDetalle'].setValidators( []);
      this.moduleForm.controls['vulnerabilidadClienteCiudadanoDetalle'].updateValueAndValidity();
      this.moduleForm.controls['etniaClienteCiudadanoDetalle'].setValidators( []);
      this.moduleForm.controls['etniaClienteCiudadanoDetalle'].updateValueAndValidity();

      this.moduleForm.controls['correoElectronicoCliente'].setValidators([]);
      this.moduleForm.controls['correoElectronicoCliente'].updateValueAndValidity();
    }

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
