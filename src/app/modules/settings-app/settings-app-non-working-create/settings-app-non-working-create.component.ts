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

import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { SweetAlertService } from "src/app/services/sweet-alert.service";
import { RestService } from "src/app/services/rest.service";
import { environment } from "src/environments/environment";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { Router } from "@angular/router";
import { GlobalAppService } from "src/app/services/global-app.service";
import { FormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { MatDatepicker, MatDatepickerInputEvent } from "@angular/material/datepicker";
@Component({
  selector: "app-settings-app-non-working-create",
  templateUrl: "./settings-app-non-working-create.component.html",
  styleUrls: ["./settings-app-non-working-create.component.css"],
})
export class SettingsAppNonWorkingCreateComponent implements OnInit {
  // Autorizacion de localstorage
  authorization: string;
  // Nombre del formulario
  textForm = "Registro de días no laborados"; // i18n
  // Ruta a redirigir
  redirectionPath = "/setting/non-working-days-index";
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { name: "Configuración", route: "/setting" },
    { name: "Días no laborados", route: this.redirectionPath },
  ];
  breadcrumbRouteActive = "Crear"; // i18n
  // Version api
  versionApi = environment.versionApiDefault;
  /**
   * Configuraciones para los servicios
   */
  resSerFormSubmit: any;
  resSerFormSubmitErr: any;

  // Variable del formulario
  moduleForm: UntypedFormGroup;

  initCardHeaderIcon = "alarm_off";

  // Variables para el boton flotante
  iconMenu: string = "save";

  // Variables para calendario de selección múltiple
  public minDate: Date;
  public maxDate: Date;
  public initDate = new Date();
  public modelDate = [];
  @ViewChild("picker", { static: true }) _picker: MatDatepicker<Date>;
  // referencias: https://stackblitz.com/edit/angular-material-multiple-dates?file=src%2Fapp%2Fdatepicker-overview-example.html

  constructor(
    public sweetAlertService: SweetAlertService,
    public restService: RestService,
    public lhs: LocalStorageService,
    private router: Router,
    public globalAppService: GlobalAppService,
    private formBuilder: UntypedFormBuilder
  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear);
    this.maxDate = new Date(currentYear + 1, 11, 31);

    /**
     * Configuración del formulario
     */
    this.moduleForm = this.formBuilder.group({
      fechaCgDiaNoLaborado: new UntypedFormControl(new Date(0), Validators.compose([])),
    });
  }

  ngOnInit() {
    // Hace el llamado del token
    this.getTokenLS();
  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    // Se consulta si el token se envió como input //
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
    });
  }

  submitForm() {
    if (this.modelDate.length == 0) {
      this.sweetAlertService.sweetInfo("Algo está mal", ["El campo es obligatorio"]);
    } else {
      /**
       * Cargando true
       */
      this.sweetAlertService.sweetLoading();
      /** Se reasigna el valor para enviar la estructura correcta al backend */
      let data = {
        arrayDate: this.modelDate,
      };

      this.restService
        .restPost(this.versionApi + "configuracionApp/dias-no-laborados/create", data, this.authorization)
        .subscribe(
          (res) => {
            this.resSerFormSubmit = res;
            // Evaluar respuesta del servicio
            this.globalAppService.resolveResponse(this.resSerFormSubmit, false).then((res) => {
              let responseResolveResponse = res;
              if (responseResolveResponse == true) {
                // Muestra el mensaje
                this.sweetAlertService.showNotification("success", this.resSerFormSubmit.message);
                // Redirecciona a la pagina principal
                this.router.navigate([this.redirectionPath]);
              }
              // Cargando false
              this.sweetAlertService.sweetClose();
            });
          },
          (err) => {
            this.resSerFormSubmitErr = err;
            // Evaluar respuesta de error del servicio
            this.globalAppService.resolveResponseError(this.resSerFormSubmitErr, false).then((res) => {});
          }
        );
    }
  }

  /**
   *
   * @param event
   * Cuando se hace clic en el botón se envia el formulario
   */
  menuPrimaryReceiveData(event) {
    let buttonSubmit = <HTMLFormElement>document.getElementById("sendForm");
    buttonSubmit.click();
  }

  /**
   * Inicio de funciones para calendario de selección múltiple
   */
  public dateClass = (date: Date) => {
    if (this._findDate(date) !== -1) {
      return ["selected"];
    }
    return [];
  };

  public dateChanged(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      const date = event.value;
      const index = this._findDate(date);
      if (index === -1) {
        this.modelDate.push(date);
      } else {
        this.modelDate.splice(index, 1);
      }

      // Se coloca valor al campo para que no quede vacío
      this.moduleForm.controls["fechaCgDiaNoLaborado"].setValue(new Date(0));

      // Cerrar calendario
      const closeFn = this._picker.close;
      this._picker.close = () => {};
      this._picker["_popupComponentRef"].instance._calendar.monthView._createWeekCells();
      setTimeout(() => {
        this._picker.close = closeFn;
      });
    }
  }

  public remove(date: Date): void {
    const index = this._findDate(date);
    this.modelDate.splice(index, 1);
  }

  private _findDate(date: Date): number {
    return this.modelDate.map((m) => +m).indexOf(+date);
  }
  /**
   * Fin de funciones para calendario de selección múltiple
   */
}
