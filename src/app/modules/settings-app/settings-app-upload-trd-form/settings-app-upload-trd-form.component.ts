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
import { ThemePalette} from '@angular/material/core';

export interface ListaBusq {
  id: string;
  val: string;
}

@Component({
  selector: 'app-settings-app-upload-trd-form',
  templateUrl: './settings-app-upload-trd-form.component.html',
  styleUrls: ['./settings-app-upload-trd-form.component.css']
})
export class SettingsAppUploadTrdFormComponent implements OnInit {

  @Output() public submitFormEmit = new EventEmitter<any>();
  // Parametro de operaciones
  @Input() paramOID = 0;
  // Nombre de tarjetas del formulario
  @Input() textForm = 'Configuración inicial carga TRD';
  // Nombre de tarjetas del formulario
  @Input() textFormCard = 'Configuración lectura de información carga TRD';
  // Iconos del formulario
  @Input() initCardHeaderIcon = 'settings_applications';
  @Input() initCardHeaderIconDatos = 'library_books';

  /** Las variables para mostrar la alerta informativa  */
  @Input() subMenuNotificationClassAlert: string = 'alert alert-info alert-with-icon';
  subMenuNotificationMessageTrd: string = 'textNotificationMasiveTrdCuatro';

  /** BreadcrumbOn  */
  @Input() breadcrumbOn = [
    { 'name': 'Configuración carga TRD', 'route': '/setting/upload-trd-index' }
  ];
  @Input() breadcrumbRouteActive = 'Configuración carga TRD';
  @Input() structureStatusTrd: boolean = false;

  @Input() statusRegional: boolean = false;
  @Input() statusNorma: boolean = false;
  @Input() statusSoporte: boolean = false;
  @Input() statusDias: boolean = false;

  // Valida typo
  validTextType: boolean = false;

  // Variable del formulario
  moduleForm: UntypedFormGroup;
  // Autentificacion
  authorization: string;
  // Version api
  versionApi = environment.versionApiDefault;
  // Ruta a redirigir
  redirectionPath = '/setting/upload-trd-index';
  // Variables de consumo de servicios
  resSerFormSubmit: any;
  resSerFormSubmitErr: any;
  // Variables para el boton flotante
  iconMenu: string = 'save';
  /** Subject that emits when the component has been destroyed. */
  _onDestroy = new Subject<void>();

  /** Variables para llamarlas listas del formulario */
  resSerlistGeneral: any;
  resSerlistGeneralErr: any;
  listMascara: any;      // Tipos documentales

  /** slide-toggle  */
  color: ThemePalette = 'primary';
  checked = false;
  disabled = false;

  /** lists filtered + nombrelista by search keyword */
  filteredlistMascara: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);

  constructor(private formBuilder: UntypedFormBuilder, public lhs: LocalStorageService, public restService: RestService,
    public globalAppService: GlobalAppService, public sweetAlertService: SweetAlertService ) {
      /**
     * Configuración del formulario para el login
     */
    this.moduleForm = this.formBuilder.group({
      idMascaraCgTrd: new UntypedFormControl({value: '', disabled: false}, Validators.required),
      cellDependenciaCgTrd: new UntypedFormControl({value: '', disabled: false}, Validators.required),
      cellTituloDependCgTrd: new UntypedFormControl({value: '', disabled: false}, Validators.required),
      cellDatosCgTrd: new UntypedFormControl({value: '', disabled: false}, Validators.required),
      columnCodigoCgTrd: new UntypedFormControl({value: '', disabled: false}, Validators.required),
      columnNombreCgTrd: new UntypedFormControl({value: '', disabled: false}, Validators.required),
      columnAgCgTrd: new UntypedFormControl({value: '', disabled: false}, Validators.required),
      columnAcCgTrd: new UntypedFormControl({value: '', disabled: false}, Validators.required),
      columnCtCgTrd: new UntypedFormControl({value: '', disabled: false}, Validators.required),
      columnECgTrd: new UntypedFormControl({value: '', disabled: false}, Validators.required),
      columnSCgTrd: new UntypedFormControl({value: '', disabled: false}, Validators.required),
      columnMCgTrd: new UntypedFormControl({value: '', disabled: false}, Validators.required),
      columnProcessCgTrd: new UntypedFormControl({value: '', disabled: false}, Validators.required),

      columnTipoDocCgTrd: new UntypedFormControl({value: ''}),
      cellDependenciaPadreCgTrd: new UntypedFormControl({value: '', disabled: false}, Validators.required),

      cellRegionalCgTrd:   new UntypedFormControl({value: ''}),
      column2CodigoCgTrd:  new UntypedFormControl({value: ''}),
      column3CodigoCgTrd:  new UntypedFormControl({value: ''}),
      columnNormaCgTrd:    new UntypedFormControl({value: ''}),
      columnPSoporteCgTrd: new UntypedFormControl({value: ''}),
      columnESoporteCgTrd: new UntypedFormControl({value: ''}),
      columnOSoporteCgTrd: new UntypedFormControl({value: ''}),
      
      tieneNorma: new UntypedFormControl('', Validators.compose([])),
      tieneRegional: new UntypedFormControl('', Validators.compose([])),
      tieneSoporte: new UntypedFormControl('', Validators.compose([])),
      tieneDias: new UntypedFormControl('', Validators.compose([])),
  
      /** Campos para hacer la busqueda en las listas este deben llamarse
       * Como las listas  "nombreLista + Filter"
       */

      listMascaraFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
    });
  }

  ngOnInit() {
    // Hace el llamado del token
    this.getTokenLS();
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
      this.getListGeneral();

      if (this.paramOID != 0) {
        this.onSearchId(this.paramOID, this.authorization);
      }
    });
  }

  // Consume servicio de listas
  getListGeneral() {

    this.restService.restGet(this.versionApi + 'configuracionApp/trd-mascaras/index-list', this.authorization).subscribe(
      (data) => {
        this.resSerlistGeneral = data;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerlistGeneral).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {
            // Lista mascaras
            if ( this.resSerlistGeneral.data ) {
              this.listMascara = this.resSerlistGeneral.data;
              // load the list initial
              this.filteredlistMascara.next(this.listMascara.slice());
            }

          }
        });
      }, (err) => {
        this.resSerlistGeneralErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerlistGeneralErr).then((res) => { });
      }
    );
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

    this.restService.restGetParams( this.versionApi + 'configuracionApp/cg-trd/index-one', params, authori).subscribe(
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
   *
   * @param event
   * Cuando se hace clic en el botón se envia el formulario
   */
  menuPrimaryReceiveData(event) {
    let buttonSubmit = <HTMLFormElement>document.getElementById('sendForm');
    buttonSubmit.click();
  }

  /**
   * Esta función permite realizar una validación con relación a la configuración asignada
   * a la mascara seleccionada.
   */
  estructuratrd(){
    
     // Se verifica que el valor seleccionado en la lista sea igual a "Columnas separadas"
     if(this.moduleForm.controls['idMascaraCgTrd'].value == environment.mascaraTRD.columnasSeparadas ){
        this.structureStatusTrd = true;
        this.moduleForm.controls['column2CodigoCgTrd'].setValue('');
        this.moduleForm.controls['column3CodigoCgTrd'].setValue('');
        this.moduleForm.controls['column2CodigoCgTrd'].setValidators(Validators.required);
        this.moduleForm.controls['column3CodigoCgTrd'].setValidators(Validators.required);
     }else{
        this.structureStatusTrd = false;
        this.moduleForm.controls['column2CodigoCgTrd'].setValue('0');
        this.moduleForm.controls['column3CodigoCgTrd'].setValue('0');
     }
  }

    /**
   * Esta función permite realizar una validación con relación a la configuración asignada
   * para saber si tiene o no soporte.
   */
  estructurasoporte(event){

     // Se verifica que el valor seleccionado en la lista sea igual a "Columnas separadas"
    if (event.checked) {
       this.statusSoporte = true;
       this.moduleForm.controls['columnPSoporteCgTrd'].setValue('');
       this.moduleForm.controls['columnESoporteCgTrd'].setValue('');
       this.moduleForm.controls['columnOSoporteCgTrd'].setValue('');
       this.moduleForm.controls['columnPSoporteCgTrd'].setValidators(Validators.required);
       this.moduleForm.controls['columnESoporteCgTrd'].setValidators(Validators.required);
      //  this.moduleForm.controls['columnOSoporteCgTrd'].setValidators(Validators.required);
   }else{
       this.statusSoporte = false;
       this.moduleForm.controls['columnPSoporteCgTrd'].setValue('0');
       this.moduleForm.controls['columnESoporteCgTrd'].setValue('0');
       this.moduleForm.controls['columnOSoporteCgTrd'].setValue('0');
    }
  }

    /**
   * Esta función permite realizar una validación con relación a la configuración asignada
   * para saber si tiene o no regional.
   */
  estructuraregional(event){

    // Se verifica que el valor seleccionado en la lista sea igual a "Columnas separadas"
    if (event.checked) {
       this.statusRegional = true;
       this.moduleForm.controls['cellRegionalCgTrd'].setValue('');
       this.moduleForm.controls['cellRegionalCgTrd'].setValidators(Validators.required);
    }else{
       this.statusRegional = false;
       this.moduleForm.controls['cellRegionalCgTrd'].setValue('0');
    }
  }

    /**
   * Esta función permite realizar una validación con relación a la configuración asignada
   * para saber si tiene o no norma.
   */
  estructuranorma(event){
    
    // Se verifica que el valor seleccionado en la lista sea igual a "Columnas separadas"
    if (event.checked) {
       this.statusNorma = true;
       this.moduleForm.controls['columnNormaCgTrd'].setValue('');
       this.moduleForm.controls['columnNormaCgTrd'].setValidators(Validators.required);
    }else{
       this.statusNorma = false;
       this.moduleForm.controls['columnNormaCgTrd'].setValue('0');
    }
  }

      /**
   * Esta función permite realizar una validación con relación a la configuración asignada
   * para saber si tiene o no norma.
   */
  estructuradias(event){
    
    // Se verifica que el valor seleccionado en la lista sea igual a "Columnas separadas"
    if (event.checked) {
       this.statusDias = true;
       this.moduleForm.controls['columnTipoDocCgTrd'].setValue('');
       this.moduleForm.controls['columnTipoDocCgTrd'].setValidators(Validators.required);
    }else{
       this.statusDias = false;
       this.moduleForm.controls['columnTipoDocCgTrd'].setValue('0');
    }
  }

}
