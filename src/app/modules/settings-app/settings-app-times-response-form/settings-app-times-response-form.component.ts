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

import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import swal from 'sweetalert2';

export interface ListaBusq {
  id: string;
  val: string;
}

@Component({
  selector: 'app-settings-app-times-response-form',
  templateUrl: './settings-app-times-response-form.component.html',
  styleUrls: ['./settings-app-times-response-form.component.css']
})
export class SettingsAppTimesResponseFormComponent implements OnInit, OnDestroy {

  @Output() public submitFormEmit = new EventEmitter<any>();
  // Autentificacion
  authorization: string;
  // Parametro de operaciones
  @Input() paramOID = 0;
  // Nombre del boton
  @Input() textButtonForm = 'Enviar';
  // Nombre del formulario
  @Input() textFormRol = 'TitleFormHorarioLaboral';
  // Valida nombre rol
  validTextType: boolean = false;
  // Icono del formulario
  @Input() initCardHeaderIcon = 'query_builder';
  /** BreadcrumbOn  */
  @Input() breadcrumbOn = [
    { 'name': 'Configuración', 'route': '/setting' }
  ];
  @Input() breadcrumbRouteActive = '';

  /**
   * Configuraciones para los servicios
   */
  resSerlistGeneral: any;
  resSerlistGeneralErr: any;
  responseServiceFormSubmit: any;
  responseServiceFormSubmitErr: any;
  responseServiceOperaciones: any;
  responseServiceOperacionesErr: any;
  moduleForm: UntypedFormGroup;
  type: UntypedFormGroup;
  modulosRol: any;
  operations: any;
  dataOperationsTrue: Array<any> = [];
  /** Boton flotante */
  iconMenu: string = 'save';

  // Version api
  versionApi = environment.versionApiDefault;

  /** Variables de internacionalización */
  activeLang: string;
  languageReceive: any;
  subscriptionTranslateService$: Subscription;

  existenRadicados: boolean = false; //Determina si existen radicados creados con el tipo seleccionado
  mostrarCodigoradicado: boolean = false; //Determina si se muestra el campo codigo de radicado

  //this.uploadForm.controls['idTipoDocumento'].clearValidators();
  
  _onDestroy = new Subject<void>();

  /** Variables para llamarlas listas del formulario */
  listfechaInicio: any;     
  listFechaFin:any;

  /** lists filtered + nombrelista by search keyword */
  filteredlistFechaInicio: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);
  filteredlistFechaFin: ReplaySubject<ListaBusq[]> = new ReplaySubject<ListaBusq[]>(1);

  /** Variables para traer el texto de confirmacion */
  titleMsg: string;
  textMsg: string;
  bntCancelar: string;
  btnConfirmacion: string;
  resSerLenguage: any;
  
  /** Validacion primer registro */
  primerRegistro: boolean = true;

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
    this.moduleForm = this.formBuilder.group({

      diaInicioCgHorarioLaboral: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      listFechaInicioFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      diaFinCgHorarioLaboral: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      listFechaFinFilter: new UntypedFormControl('', Validators.compose([
        // Validators.required
      ])),
      horaInicioCgHorarioLaboral: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      horaFinCgHorarioLaboral: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      estadoCgHorarioLaboral: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),

    });

    this.moduleForm.controls['listFechaInicioFilter'].valueChanges.pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBanks('listfechaInicio');
    });
    this.moduleForm.controls['listFechaFinFilter'].valueChanges.pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBanks('listFechaFin');
    });

    this.detectLanguageChange();
  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {

    // Se consulta si el token se envió como input //
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
      this.getListGeneral();
      if ( this.paramOID != 0 ) {
        this.onSearchId(this.paramOID, this.authorization);
      }else {
        this.moduleForm.controls['estadoCgHorarioLaboral'].setValue(10);
        this.moduleForm.controls['estadoCgHorarioLaboral'].disable();
      }
    });
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

  this.restService.restGetParams(versionApi + 'configuracionApp/cg-tiempos-respuesta/index-one', params, authori )
    .subscribe((res) => {
      this.responseServiceFormSubmit = res;
      // Evaluar respuesta del servicio
      this.globalAppService.resolveResponse(this.responseServiceFormSubmit, true, '/setting/filing-types-index').then((res) => {
        let responseResolveResponse = res;
        if (responseResolveResponse == true) {
          if ( this.responseServiceFormSubmit.data ) {
            for (let name in this.responseServiceFormSubmit.data) {
              if (this.moduleForm.controls[name]) {
                  this.moduleForm.controls[name].setValue(this.responseServiceFormSubmit.data[name]);
              }
            }
          }
          if ( this.responseServiceFormSubmit.existenRadicados ) {
            this.existenRadicados = this.responseServiceFormSubmit.existenRadicados;

            if (this.existenRadicados == true) {
              this.moduleForm.controls['codigoCgTipoRadicado'].disable();
            }
          }
        }
      });
    }, (err) => {
      this.responseServiceFormSubmitErr = err;
      // Evaluar respuesta de error del servicio
      this.globalAppService.resolveResponseError(this.responseServiceFormSubmitErr, true, '/setting/filing-types-index').then((res) => { });
    }
  );
}

  submitmoduleForm() {

    if (this.moduleForm.valid) {

      if(this.moduleForm.controls['estadoCgHorarioLaboral'].value == 0){
        this.submitFormEmit.emit(this.moduleForm.value);
      }else{

        if(this.primerRegistro){
          this.submitFormEmit.emit(this.moduleForm.value);
        }else{
          
          // Cambia el los mensajes de texto del componete para confirmar la eliminacion
          this.globalAppService.text18nGet().then((res) => {
        
            this.resSerLenguage = res;
            this.textMsg = this.resSerLenguage['textMsgChangeStatus'];
            this.titleMsg = this.resSerLenguage.titleMsg
            this.bntCancelar = this.resSerLenguage['bntCancelarSendMail'];
            this.btnConfirmacion = this.resSerLenguage['btnConfirmar'];
        
            swal({
              title: this.titleMsg,
              text: this.textMsg,
              type: 'warning',
              showCancelButton: true,
              cancelButtonText: this.bntCancelar,
              confirmButtonText: this.btnConfirmacion,
              cancelButtonClass: 'btn btn-danger',
              confirmButtonClass: 'btn btn-success',
              buttonsStyling: false
            }).then((result) => {
        
              if(result.value){
                this.submitFormEmit.emit(this.moduleForm.value);
              }
             
            });
          });  
        }

      }


    } else {
      this.sweetAlertService.sweetInfo('Algo está mal', '');
    }

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

  getListGeneral(){
    this.restService.restGet(this.versionApi + 'configuracionApp/cg-tiempos-respuesta/general-filing-lists', this.authorization).subscribe(
      (data) => {
        this.resSerlistGeneral = data;
        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.resSerlistGeneral).then((res) => {
          let responseResolveResponse = res;
          if (responseResolveResponse == true) {

            /** Informacion del usuario logueado */
            if (this.resSerlistGeneral.dataDays) {
              this.listfechaInicio = this.resSerlistGeneral.dataDays;
              // load the list initial
              this.filteredlistFechaInicio.next(this.listfechaInicio.slice());

              this.listFechaFin = this.resSerlistGeneral.dataDays;
              // load the list initial
              this.filteredlistFechaFin.next(this.listFechaFin.slice());
            }
            
            /** Validacion para primer registro */
            this.primerRegistro = this.resSerlistGeneral.primerRegistro;
          }
        });
      }, (err) => {
        this.resSerlistGeneralErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.resSerlistGeneralErr).then((res) => { });
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

  onlyNumberKey(e) {
    return (e.charCode === 8 || e.charCode === 0) ? null : e.charCode >= 48 && e.charCode <= 57;
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
    this.subscriptionTranslateService$ = this.activateTranslateService.activateLanguageChange.subscribe(language => {
      this.languageReceive = language;
      this.translate.setDefaultLang(this.languageReceive);
      this.activeLang = this.languageReceive;
    });
  }
  /** Fin Métodos para el uso de la internacionalización */

  ngOnDestroy(): void {
    if (!!this.subscriptionTranslateService$) this.subscriptionTranslateService$.unsubscribe();
  }

}
