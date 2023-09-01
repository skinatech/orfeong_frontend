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

import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from "@angular/forms";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { SweetAlertService } from "src/app/services/sweet-alert.service";
import { environment } from "src/environments/environment";
import { RestService } from "src/app/services/rest.service";
import { GlobalAppService } from "src/app/services/global-app.service";
import { TranslateService } from "@ngx-translate/core";
import { ActivateTranslateService } from "src/app/services/activate-translate.service";
import { ThemePalette } from "@angular/material/core";
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from "@angular/router";

@Component({
  selector: "app-settings-app-filing-types-form",
  templateUrl: "./settings-app-filing-types-form.component.html",
  styleUrls: ["./settings-app-filing-types-form.component.css"],
})
export class SettingsAppFilingTypesFormComponent implements OnInit, OnDestroy {
  @Output() public submitFormEmit = new EventEmitter<any>();
  // Autentificacion
  authorization: string;
  // Parametro de operaciones
  @Input() paramOID = 0;
  // Nombre del boton
  @Input() textButtonForm = "Enviar";
  // Nombre del formulario
  @Input() textFormRol = "Formulario tipo radicado";
  // Valida nombre rol
  validTextType: boolean = false;
  // Icono del formulario
  @Input() initCardHeaderIcon = "description";
  /** BreadcrumbOn  */
  @Input() breadcrumbOn = [{ name: "Configuración", route: "/setting" }];
  @Input() breadcrumbRouteActive = "Tipos de radicado";
  @Input() urlParamTypeResolutions: string;

  /**
   * Configuraciones para los servicios
   */
  responseServiceFormSubmit: any;
  responseServiceFormSubmitErr: any;
  responseServiceOperaciones: any;
  responseServiceOperacionesErr: any;
  responseServiceTiposDocumentales: any;
  responseServiceTiposDocumentalesErr: any;
  filingTypesForm: UntypedFormGroup;
  type: UntypedFormGroup;

  modulosRol: any;
  operations: any;
  modulosTiposDocumentales: any;
  tiposDocumentales: any;

  documentTypesRadiStatus: boolean = false;

  dataOperationsTrue: Array<any> = [];
  dataDocumentalTypesTrue: Array<any> = [];
  /** Boton flotante */
  iconMenu: string = "save";

  msgSelectMinPermiso = {
    es: "El tipo de radicado debe tener al menos un transacción asociada",
    en: "The filing type must have at least one associated transaction",
    br: "O tipo de arquivamento deve ter pelo menos uma transação associada",
  };

  /** Las variables para mostrar la alerta informativa  */
  @Input() initialNotificationClassAlert: string = "alert alert-info alert-with-icon";
  initialNotificationMessageArray: any = [];

  /** Variables de internacionalización */
  activeLang: string;
  languageReceive: any;
  subscriptionTranslateService$: Subscription;

  existenRadicados: boolean = false; // Determina si existen radicados creados con el tipo seleccionado
  isCodigoFijo: boolean = false; // Determina si es el código es fijo y no se puede modificar
  mostrarCodigoradicado: boolean = false; // Determina si se muestra el campo codigo de radicado

  maxlengthConsecutivoRadicado = null;
  /** slide-toggle  */
  color: ThemePalette = "primary";
  checked = false;
  disabled = false;
  disabledSelect: boolean = true;
  titleMultiple = "Único radicado con múltiples remitentes";
  messageMultiple = "No";
  validaMultiple: boolean = true;
  validaMultipleClass = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
  classFormCreate = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
  // this.uploadForm.controls['idTipoDocumento'].clearValidators();

  constructor(
    private formBuilder: UntypedFormBuilder,
    public lhs: LocalStorageService,
    public sweetAlertService: SweetAlertService,
    public restService: RestService,
    public globalAppService: GlobalAppService,
    private translate: TranslateService,
    private activateTranslateService: ActivateTranslateService,
    private router: Router
  ) {
    this.detectLanguageInitial();
  }

  ngOnInit() {
    window.scroll(0, 0); // Posicionando scroll al inicio
    // Hace el llamado del token
    this.getTokenLS();
    /**
     * Configuración del formulario para el login
     */
    this.filingTypesForm = this.formBuilder.group({
      codigoCgTipoRadicado: new UntypedFormControl("", Validators.compose([Validators.required])),
      nombreCgTipoRadicado: new UntypedFormControl("", Validators.compose([Validators.required])),
      operacionesRol: new UntypedFormControl(
        "",
        Validators.compose([
          // Validators.required
        ])
      ),
      tiposDocumentalesRadicado: new UntypedFormControl(
        "",
        Validators.compose([
          // Validators.required
        ])
      ),
      unicoRadiCgTipoRadicado: new UntypedFormControl(
        false,
        Validators.compose([
          // Validators.required
        ])
      ),
      numeracionCgTiposRadicadosResoluciones: new UntypedFormControl(""),
      activatedResolutions: new UntypedFormControl(this.urlParamTypeResolutions),
    });
    this.detectLanguageChange();

    // Valida si puede seleccionar multiples remitentes con un solo numero de radicado
    this.validaCapoMultiple();

    if (this.urlParamTypeResolutions === "true") {
      this.classFormCreate = "col-lg-4 col-md-4 col-sm-12 col-xs-12";
      this.filingTypesForm.controls["numeracionCgTiposRadicadosResoluciones"].setValidators(Validators.required);
      this.filingTypesForm.controls["numeracionCgTiposRadicadosResoluciones"].setValidators(
        Validators.pattern(/[0-9]/)
      );
      this.filingTypesForm.controls["nombreCgTipoRadicado"].setValue("RESOLUCIONES");
    }
  }

  submitFilingTypesForm() {
    this.dataOperationsTrue.length = 0; // Limpio el array que contiene los ids de las operaciones
    this.dataDocumentalTypesTrue.length = 0; // Limpio el array que contiene los ids de los tipos documentales

    this.toAssignOperatios(); // Se Corre el metodo que contiene la asiganación de ids de las operaciones y tipos documentales

    this.filingTypesForm.controls["operacionesRol"].setValue(this.dataOperationsTrue); // Se pasa el array de ids al campo del formulario
    this.filingTypesForm.controls["tiposDocumentalesRadicado"].setValue(this.dataDocumentalTypesTrue); // Se pasa el array de ids al campo del formulario

    if (this.filingTypesForm.valid) {
      if (this.dataOperationsTrue.length === 0) {
        this.sweetAlertService.sweetInfo("Algo está mal", [this.msgSelectMinPermiso[this.activeLang]]);
      } else {
        this.submitFormEmit.emit(this.filingTypesForm.value);
      }
    } else {
      this.sweetAlertService.sweetInfo("Algo está mal", "");
    }
  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    // Se consulta si el token se envió como input //
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
      this.getRolOperacionesAll(this.authorization);
      this.getTiposDocumentalesAll(this.authorization);
      if (this.paramOID != 0) {
        this.onSearchId(this.paramOID, this.authorization);
      }
    });
  }

  getRolOperacionesAll(val) {
    // this.sweetAlerparamOIDtService.sweetLoading();
    let versionApi = environment.versionApiDefault;
    let params = {
      id: this.paramOID,
    };

    this.restService
      .restGetParams(versionApi + "configuracionApp/tipos-radicados/index-all-transactions", params, val)
      .subscribe(
        (res) => {
          this.responseServiceOperaciones = res;
          // console.log( this.responseServiceOperaciones );
          // Evaluar respuesta del servicio
          this.globalAppService
            .resolveResponse(this.responseServiceOperaciones, true, "/setting/filing-types-index")
            .then((res) => {
              let responseResolveResponse = res;
              if (responseResolveResponse == true) {
                this.modulosRol = this.responseServiceOperaciones.data.modulos;
                this.operations = this.responseServiceOperaciones.data.operaciones;
                this.mostrarCodigoradicado = this.responseServiceOperaciones.mostrarCodigoradicado;
                if (this.mostrarCodigoradicado == false) {
                  this.filingTypesForm.controls["codigoCgTipoRadicado"].disable();
                  this.filingTypesForm.controls["codigoCgTipoRadicado"].clearValidators();
                  this.filingTypesForm.controls["codigoCgTipoRadicado"].updateValueAndValidity();
                }
                /** Validar tipo de código del radicado */
                if (typeof this.responseServiceOperaciones.codigoradicado) {
                  let codigoradicado = this.responseServiceOperaciones.codigoradicado;
                  if (codigoradicado == "texto") {
                    this.initialNotificationMessageArray = ["textFormTypeFilingText"];
                  } else if (codigoradicado == "numero") {
                    this.initialNotificationMessageArray = ["textFormTypeFilingNumber"];
                  }
                }
                /** Fin Validar tipo de código del radicado */
                if (typeof this.responseServiceOperaciones.longitudRadicado) {
                  this.maxlengthConsecutivoRadicado = this.responseServiceOperaciones.longitudRadicado;
                }
              }
            });
        },
        (err) => {
          this.responseServiceOperacionesErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService
            .resolveResponseError(this.responseServiceOperacionesErr, true, "/setting/filing-types-index")
            .then((res) => {});
        }
      );
  }

  getTiposDocumentalesAll(val) {
    // this.sweetAlerparamOIDtService.sweetLoading();
    let versionApi = environment.versionApiDefault;
    let params = {
      id: this.paramOID,
    };

    this.restService
      .restGetParams(versionApi + "configuracionApp/tipos-radicados/index-all-documental-types", params, val)
      .subscribe(
        (res) => {
          this.responseServiceTiposDocumentales = res;
          // Evaluar respuesta del servicio
          this.globalAppService
            .resolveResponse(this.responseServiceTiposDocumentales, true, "/setting/filing-types-index")
            .then((res) => {
              let responseResolveResponse = res;
              if (responseResolveResponse == true) {
                this.documentTypesRadiStatus = this.responseServiceTiposDocumentales.documentTypesRadiStatus;
                this.modulosTiposDocumentales = this.responseServiceTiposDocumentales.data.modulosTiposDocumentales;
                this.tiposDocumentales = this.responseServiceTiposDocumentales.data.tiposDocumentales;
              }
            });
        },
        (err) => {
          this.responseServiceTiposDocumentalesErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService
            .resolveResponseError(this.responseServiceTiposDocumentalesErr, true, "/setting/filing-types-index")
            .then((res) => {});
        }
      );
  }

  /** Metodo para asignar los ids de las operaciones a un array y ese array pasarlo al formulario en el campo operacionesRol y tiposDocumentalesRadicado */
  toAssignOperatios() {
    this.modulosRol.forEach((modules) => {
      this.operations[modules.name].forEach((operations) => {
        if (operations.value == true) {
          this.dataOperationsTrue.push(operations.id);
        }
      });
    });

    this.modulosTiposDocumentales.forEach((modules) => {
      this.tiposDocumentales[modules.name].forEach((tipoDoc) => {
        if (tipoDoc.value == true) {
          this.dataDocumentalTypesTrue.push(tipoDoc.id);
        }
      });
    });
  }

  validateInputParent(e) {
    this.modulosRol.forEach((modules) => {
      // console.log(modules);
      if (modules.name == e.target.value) {
        modules.value = e.target.checked;
      }
    });

    this.operations[e.target.value].forEach((modules) => {
      modules.value = e.target.checked;
    });
  }

  validateInputParentDocumentType(e) {
    this.modulosTiposDocumentales.forEach((modules) => {
      if (modules.name == e.target.value) {
        modules.value = e.target.checked;
      }
    });

    this.tiposDocumentales[e.target.value].forEach((modules) => {
      modules.value = e.target.checked;
    });
  }

  validateInputChildren(e) {
    this.operations[e.target.name].forEach((operations) => {
      if (operations.id == e.target.value) {
        operations.value = e.target.checked;
      }
    });

    if (e.target.checked) {
      let countModuleOperation = this.operations[e.target.name].length;
      this.operations[e.target.name].forEach((operations) => {
        if (operations.value == e.target.checked) {
          countModuleOperation = countModuleOperation - 1;
        }
      });

      if (countModuleOperation == 0) {
        this.modulosRol.forEach((modules) => {
          if (modules.name == e.target.name) {
            modules.value = true;
          }
        });
      }
    } else {
      this.modulosRol.forEach((modules) => {
        if (modules.name == e.target.name) {
          modules.value = false;
        }
      });
    }
  }

  validateInputChildrenDocumentType(e) {
    this.tiposDocumentales[e.target.name].forEach((documentType) => {
      if (documentType.id == e.target.value) {
        documentType.value = e.target.checked;
      }
    });

    if (e.target.checked) {
      let countModuleOperation = this.tiposDocumentales[e.target.name].length;
      this.tiposDocumentales[e.target.name].forEach((documentType) => {
        if (documentType.value == e.target.checked) {
          countModuleOperation = countModuleOperation - 1;
        }
      });

      if (countModuleOperation == 0) {
        this.modulosTiposDocumentales.forEach((modules) => {
          if (modules.name == e.target.name) {
            modules.value = true;
          }
        });
      }
    } else {
      this.modulosTiposDocumentales.forEach((modules) => {
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
  onSearchId(id, authori) {
    // Cargando true
    this.sweetAlertService.sweetLoading();

    let versionApi = environment.versionApiDefault;
    let params = {
      id: this.paramOID,
    };

    this.restService
      .restGetParams(versionApi + "configuracionApp/tipos-radicados/index-one", params, authori)
      .subscribe(
        (res) => {
          this.responseServiceFormSubmit = res;
          // Evaluar respuesta del servicio
          this.globalAppService
            .resolveResponse(this.responseServiceFormSubmit, true, "/setting/filing-types-index")
            .then((res) => {
              let responseResolveResponse = res;
              if (responseResolveResponse == true) {
                if (!this.responseServiceFormSubmit.isTypeResolution && this.urlParamTypeResolutions === "true") {
                  this.router.navigate([`/setting/filing-types-index`]);
                }

                if (this.responseServiceFormSubmit.data) {
                  for (let name in this.responseServiceFormSubmit.data) {
                    if (this.filingTypesForm.controls[name]) {
                      this.filingTypesForm.controls[name].setValue(this.responseServiceFormSubmit.data[name]);
                    }
                  }
                }
                if (this.responseServiceFormSubmit.existenRadicados) {
                  this.existenRadicados = this.responseServiceFormSubmit.existenRadicados;
                  if (this.existenRadicados == true) {
                    this.filingTypesForm.controls["codigoCgTipoRadicado"].disable();
                  }
                }
                if (this.responseServiceFormSubmit.isCodigoFijo) {
                  this.isCodigoFijo = this.responseServiceFormSubmit.isCodigoFijo;
                  if (this.isCodigoFijo == true) {
                    this.filingTypesForm.controls["codigoCgTipoRadicado"].disable();
                  }
                }
                this.validaCapoMultiple();
                this.MatSlideToggleChange({ checked: this.responseServiceFormSubmit.data["unicoRadiCgTipoRadicado"] });
                // Cargando false
                this.sweetAlertService.sweetClose();
              }
            });
        },
        (err) => {
          this.responseServiceFormSubmitErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService
            .resolveResponseError(this.responseServiceFormSubmitErr, true, "/setting/filing-types-index")
            .then((res) => {});
        }
      );
  }

  onlyNumberKey(e) {
    return e.charCode === 8 || e.charCode === 0 ? null : e.charCode >= 48 && e.charCode <= 57;
  }

  MatSlideToggleChange(event) {
    /** Evaluar si el imput esta checkeado como true o false */
    if (event.checked) {
      this.messageMultiple = "Si";
    } else {
      this.messageMultiple = "No";
    }
    /** Fin Evaluar si el imput esta checkeado como true o false */
  }

  /**
   * Funcion que valida el campo si es multiple
   */
  validaCapoMultiple() {
    // Valida si es posible mostrar la información del multiple remitente
    if (
      environment.tipoRadicadoCodigo.pqrs == this.filingTypesForm.controls["codigoCgTipoRadicado"].value ||
      environment.tipoRadicadoCodigo.entrada == this.filingTypesForm.controls["codigoCgTipoRadicado"].value ||
      environment.tipoRadicadoCodigo.salida == this.filingTypesForm.controls["codigoCgTipoRadicado"].value
    ) {
      this.validaMultiple = false;
    } else {
      this.validaMultiple = true;
    }
    if (this.mostrarCodigoradicado == true || (this.mostrarCodigoradicado == false && this.paramOID != 0)) {
      this.validaMultipleClass = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
    } else {
      this.validaMultipleClass = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
    }
  }

  /**
   *
   * @param event
   * Cuando se hace clic en el botón se envia el formulario
   */
  menuPrimaryReceiveData(event) {
    var buttonSubmit = <HTMLFormElement>document.getElementById("sendForm");
    buttonSubmit.click();
  }

  /** Método para detectar el idioma de la aplicación */
  detectLanguageInitial() {
    if (localStorage.getItem("language")) {
      this.activeLang = localStorage.getItem("language");
    } else {
      this.activeLang = "es";
    }
    this.translate.setDefaultLang(this.activeLang);
  }

  detectLanguageChange() {
    this.subscriptionTranslateService$ = this.activateTranslateService.activateLanguageChange.subscribe((language) => {
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
