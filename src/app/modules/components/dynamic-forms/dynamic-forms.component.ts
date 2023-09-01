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

import { Component, OnInit, Input, EventEmitter, Output, AfterViewChecked } from "@angular/core";
import { UntypedFormGroup } from "@angular/forms";
import { FormlyFormOptions, FormlyFieldConfig } from "@ngx-formly/core";
import { FormlyJsonschema } from "@ngx-formly/core/json-schema";

import { environment } from "src/environments/environment";
import { RestService } from "../../../services/rest.service";
import { LocalStorageService } from "../../../services/local-storage.service";
import { HttpClient } from "@angular/common/http";
import { GlobalAppService } from "src/app/services/global-app.service";
import { SweetAlertService } from "../../../services/sweet-alert.service";

import * as CryptoJS from "crypto-js";

declare const $: any;

@Component({
  selector: "app-dynamic-forms",
  templateUrl: "./dynamic-forms.component.html",
  styleUrls: ["./dynamic-forms.component.css"],
})
export class DynamicFormsComponent implements OnInit, AfterViewChecked {
  versionApi: string = environment.versionApiDefault;
  authorization: any; // Token de autorización

  @Input() idRenta: number;
  @Input() typeForm: any = "anexoA"; // Anexo a consultar
  formTypeAll: any; // Anexos con toda la información
  typeTotal: string = "cuadroATotales"; // Guarda el valor de la pestaña de total
  @Input() icon: any; // Icono de Formulario
  @Input() titleCard: any; // Titulo del Formulario
  // Pestañas de los anexos
  @Input() pestanAnexos = [{ name: "A", val: "" }];
  routeSubmit: any; // Consulta a ejecutar desde backend
  routeChange: any; // Consulta a ejecutar para el onchange
  statusUpdate: boolean = false; // Variable que envia la data al formulario inicial para cargarla
  botonSubmitIcon: string = "save"; // Icono del borton
  butonSubmitDisable: boolean = false;
  valorManual: boolean = false; // Cambio de campos manuales
  responseApi: any = [];
  calcular: any = 0;
  result = [];
  total: any;
  operaciones: any;
  dataEntidad: any = []; // Se genera para mostrar un array dependiente

  form = new UntypedFormGroup({});
  model = {
    cuadroA: [{}],
  };
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [];

  /** Variables de servicio de operaciones */
  responseServiceChange: any;
  responseServiceChangeErr: any;
  /** Variables de servicio guardar */
  responseServiceFormSubmit: any;
  responseServiceFormSubmitErr: any;

  /** Nombre del cuadro en que se está parado */
  cuadroAnexo: string;

  /** Array para almacenar los ids de los datos validados que cambian */
  dataChangeValues: any = [];
  responseIterarChangeValue: any;

  constructor(
    private lss: LocalStorageService,
    private formlyJsonschema: FormlyJsonschema,
    private restService: RestService,
    private http: HttpClient,
    public globalAppService: GlobalAppService,
    public sweetAlertService: SweetAlertService
  ) {
    // console.log(this.typeForm);
  }

  loadExample(type: string) {
    this.typeForm = type;
    for (var key in this.formTypeAll) {
      if (type == this.formTypeAll[key]) {
        this.typeTotal = key + "Totales";
        // console.log(this.typeTotal);
        this.cuadroAnexo = key;
      }
    }
    this.callJsonForms(type);
  }

  ngOnInit() {
    // Hace el llamado del token
    this.getTokenLS();
  }

  ngAfterViewChecked() {
    $(".cdk-global-overlay-wrapper").css("z-index", "1000");
  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    // Se consulta si el token se envió como input //
    this.lss.getToken().then((res: string) => {
      this.authorization = res;
      this.callJsonForms(this.typeForm);
    });
  }

  callJsonForms(typeForm) {
    this.sweetAlertService.sweetLoading();
    const params = {
      idRenta: this.idRenta,
      formType: typeForm,
    };

    // console.log(params);

    this.restService
      .restPost(environment.versionApiDefault + "dynamicForms/dynamic-forms/load-form", params, this.authorization)
      .subscribe((res) => {
        this.responseApi = res;
        // console.log(this.responseApi);
        this.icon = this.responseApi.data.configGlobal.icon;
        this.titleCard = this.responseApi.data.configGlobal.titleCard;
        this.botonSubmitIcon = this.responseApi.data.configGlobal.botonSubmitIcon;
        // Ruta del servicio a consumir
        this.routeSubmit = this.responseApi.data.configGlobal.routeSubmit;
        // Ruta del servicio a consumir
        this.routeChange = this.responseApi.data.configGlobal.routeChange;
        // Se agrega las operaciones a ejecutar
        this.operaciones = this.responseApi.data.configGlobal.operationsAnexos;
        // Asigna todos los formType para que se consulten
        this.formTypeAll = this.responseApi.data.configGlobal.formTypeAll;
        // Se asigna el json al formulario
        this.loadForm(this.responseApi.data.schema);
        // Carga los valores al formulario segun lo que llega de base de datos
        this.sweetAlertService.sweetClose();
        if (this.statusUpdate == false && this.responseApi.dataUpdate.statusUpdate == true) {
          this.statusUpdate = this.responseApi.dataUpdate.statusUpdate;
          this.loadFormChange(this.responseApi.dataUpdate.dataUpdate);
          this.consultaOperaciones();
        }
      });
  }

  loadForm(data: any) {
    //console.log( data );
    this.fields = data;
    // return false;

    const valFiels = data[0]["fieldArray"]["fieldGroup"].map((f) => {
      // console.log ( f );
      if (f.templateOptions && f.templateOptions.changeExpr) {
        f.templateOptions.change = Function(f.templateOptions.changeExpr).bind(this);
      }
      return f;
    });

    if (this.typeForm == "anexos15A") {
      this.consultaOperaciones();
    }

    if (this.typeForm == "anexos22A" || this.typeForm == "anexos22ADetalles") {
      this.getSelectOption();
    }

    if (this.typeForm == "anexos22B" || this.typeForm == "anexos22BDetalles") {
      this.getSelectOption();
    }

    if (this.typeForm == "anexos22C" || this.typeForm == "anexos22CDetalles") {
      this.getSelectOption();
    }

    if (this.typeForm == "anexos22D" || this.typeForm == "anexos22DDetalles") {
      this.getSelectOption();
    }

    if (this.typeForm == "anexos16A" || this.typeForm == "anexos16ADetalles") {
      this.getSelectOption();
    }
  }

  submit() {
    // alert(JSON.stringify(this.form.value));
    // Cargando true
    this.sweetAlertService.sweetLoading();
    // console.log( this.model );
    if (this.idRenta > 0) {
      // Se asignan los  valores al json
      const data = {
        idRenta: this.idRenta,
        formType: this.typeForm,
        formTypeAll: this.formTypeAll,
        formValue: this.model,
      };

      this.restService.restPut(environment.versionApiDefault + this.routeSubmit, data, this.authorization).subscribe(
        (res) => {
          this.responseServiceFormSubmit = res;
          // console.log( this.responseServiceFormSubmit );
          // Evaluar respuesta del servicio
          this.globalAppService.resolveResponse(this.responseServiceFormSubmit, false).then((res) => {
            const responseResolveResponse = res;
            if (responseResolveResponse == true) {
              // console.log('Entra responseResolveResponse == true');
              this.sweetAlertService.showSwal(
                "success-message",
                "Datos almacenados",
                this.responseServiceFormSubmit["message"]
              );
              // Carga los valores al formulario segun lo que llega de base de datos
              this.statusUpdate = this.responseServiceFormSubmit.dataUpdate.statusUpdate;
              this.loadFormChange(this.responseServiceFormSubmit.dataUpdate.dataUpdate);
              // Verificar cuando le de OK para cargar
              // this.consultaOperaciones();
            }
            // Cargando false
            // this.sweetAlertService.sweetClose();
          });
        },
        (err) => {
          this.responseServiceFormSubmitErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.responseServiceFormSubmitErr, false).then((res) => {});
        }
      );
    } else {
      this.sweetAlertService.sweetInfo("Algo está mal", "");
    }
  }

  /** Función que ejecuta servicio para crespon0seServiceFormSubmitErrlcular los valores */
  consultaOperaciones() {
    // Cargando True
    // this.sweetAlertService.sweetLoading();
    // Data que se envia
    const data = {
      idRenta: this.idRenta,
      formType: this.typeForm,
      formValue: this.model,
    };
    // alert( JSON.stringify(data) );
    // console.log(data );

    // Servicio a consumir
    this.restService.restPost(environment.versionApiDefault + this.routeChange, data, this.authorization).subscribe(
      (res) => {
        this.responseServiceChange = res;
        // console.log( this.responseServiceChange );
        localStorage.setItem("tempData", this.encryptAES(res.data, "123456789"));

        // Evaluar respuesta del servicio
        this.globalAppService.resolveResponse(this.responseServiceChange, false).then((res) => {
          const responseResolveResponse = res;
          if (responseResolveResponse == true) {
            // almacena las opciones de los select para el anexo anexos22
            if (
              this.typeForm == "anexos22A" ||
              this.typeForm == "anexos22B" ||
              this.typeForm == "anexos22ADetalles" ||
              this.typeForm == "anexos22BDetalles" ||
              this.typeForm == "anexos22C" ||
              this.typeForm == "anexos22D" ||
              this.typeForm == "anexos22CDetalles" ||
              this.typeForm == "anexos22DDetalles" ||
              this.typeForm == "anexos16A" ||
              this.typeForm == "anexos16ADetalles"
            ) {
              this.dataEntidad = this.responseServiceChange.dataEntidad;
              this.getSelectOption();
            }

            if (this.responseServiceChange.data) {
              this.loadFormChange(this.responseServiceChange.data);
            }
            if (Object.entries(this.responseServiceChange.mjsError).length > 0) {
              this.showError();
            } else {
              this.butonSubmitDisable = false;
              // Cargando false
              // this.sweetAlertService.sweetClose();
            }
          }
        });
      },
      (err) => {
        this.responseServiceChangeErr = err;
        // Evaluar respuesta de error del servicio
        this.globalAppService.resolveResponseError(this.responseServiceChangeErr, false).then((res) => {});
      }
    );
  }

  loadFormChange(data: any) {
    // console.log( 'Entra loadFormChange' );
    this.model = data;
    this.options = data;
    // Se regernera el formulario
    // this.options.resetModel();
  }

  getSelectOption() {
    // almacena las opciones de los select para el anexo anexos 22
    const camposFiels = this.fields[0]["fieldArray"]["fieldGroup"].map((f) => {
      // console.log ( f );
      if (f.key == "entidadAnexo22ADetalles" && Object.entries(this.dataEntidad).length > 0) {
        f.templateOptions.options = this.dataEntidad["cuadroAEntidad"];
      }
      if (f.key == "entidadAnexo22BDetalles" && Object.entries(this.dataEntidad).length > 0) {
        f.templateOptions.options = this.dataEntidad["cuadroBEntidad"];
      }
      if (f.key == "entidadAnexo22CDetalles" && Object.entries(this.dataEntidad).length > 0) {
        f.templateOptions.options = this.dataEntidad["cuadroCEntidad"];
      }
      if (f.key == "entidadAnexo22DDetalles" && Object.entries(this.dataEntidad).length > 0) {
        f.templateOptions.options = this.dataEntidad["cuadroDEntidad"];
      }
      if (f.key == "entidadAnexo16ADetalle" && Object.entries(this.dataEntidad).length > 0) {
        f.templateOptions.options = this.dataEntidad["cuadroAEntidad"];
      }
      return f;
    });
  }

  showError() {
    if (Object.entries(this.responseServiceChange.mjsError).length > 0) {
      let mjs = this.responseServiceChange.mjsError;
      // console.log(mjs);
      this.sweetAlertService.showSwal("title-and-text", "", mjs);
      // this.butonSubmitDisable = true;
    } else {
      // Cargando false
      // this.butonSubmitDisable = false;
      this.sweetAlertService.sweetClose();
    }
  }

  validateChangeValuesIterar(dataTemp) {
    return new Promise<any>((resolve) => {
      this.dataChangeValues = [];
      var countProcess = 0;
      for (const itemp in dataTemp[this.cuadroAnexo]) {
        countProcess = +1;
        var dataChangeValueValidate = false;

        for (const jtemp in dataTemp[this.cuadroAnexo][itemp]) {
          //console.log(`${jtemp} -- ${this.model[this.cuadroAnexo][itemp][jtemp]} === ${dataTemps[this.cuadroAnexo][itemp][jtemp]}`);
          if (this.model[this.cuadroAnexo][itemp][jtemp] !== dataTemp[this.cuadroAnexo][itemp][jtemp]) {
            dataChangeValueValidate = true;
          }
        }

        if (dataChangeValueValidate) {
          this.dataChangeValues.push(itemp);
        }
      }

      resolve(this.dataChangeValues);
    });
  }

  changeCampoModifiManual() {
    return new Promise<any>((resolve) => {
      this.validateChangeValuesIterar(this.decryptAES(localStorage.getItem("tempData"), "123456789")).then((res) => {
        this.responseIterarChangeValue = res;

        for (const ires in this.responseIterarChangeValue) {
          this.model[this.cuadroAnexo][ires]["campoModifiManual"] = true;
        }
      });

      resolve(true);
    });
  }

  cambioValorManual() {
    this.changeCampoModifiManual().then(() => {
      this.consultaOperaciones();
    });
  }

  public encryptAES(data: any, authorization: string, base64: boolean = false) {
    try {
      let encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        authorization + environment.llaveAES
        // ,{
        //   keySize: 128 / 8,
        //   iv: environment.llaveAES,
        //   mode: CryptoJS.mode.CBC,
        //   padding: CryptoJS.pad.Pkcs7
        // }
      ).toString();
      if (base64 == true) {
        encrypted = btoa(encrypted);
        encrypted = encrypted.replace(/_/g, "/");
        encrypted = encrypted.replace(/-/g, "+");
        return encrypted;
      } else {
        return encrypted;
      }
    } catch (error) {
      //console.log('error en la encriptación front-end');
      return "null";
    }
  }

  public decryptAES(encrypted: any, authorization: string) {
    try {
      let decrypted = CryptoJS.AES.decrypt(encrypted, authorization + environment.llaveAES).toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      return null;
    }
  }
}
