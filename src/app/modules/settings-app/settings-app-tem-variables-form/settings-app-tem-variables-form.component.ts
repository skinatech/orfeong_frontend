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

import { Component, OnInit, Output, Input, EventEmitter } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from "@angular/forms";
import { SweetAlertService } from "src/app/services/sweet-alert.service";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { RestService } from "src/app/services/rest.service";
import { environment } from "src/environments/environment";
import { GlobalAppService } from "src/app/services/global-app.service";
import { ResponseServiceData } from "./interfaces/settings-app-tem-variables-form.interface";

@Component({
  selector: "app-settings-app-tem-variables-form",
  templateUrl: "./settings-app-tem-variables-form.component.html",
  styleUrls: ["./settings-app-tem-variables-form.component.css"],
})
export class SettingsAppTemVariablesFormComponent implements OnInit {
  @Output() public submitFormEmit = new EventEmitter<any>();
  // Parametro de operaciones
  @Input() paramUrlId = 0;
  // Nombre de tarjetas del formulario
  @Input() textForm = "nuevaVariableDePlantilla";
  // Iconos del formulario
  @Input() initCardHeaderIcon = "mark_chat_read";
  @Input() initCardHeaderIconDatos = "library_books";
  // Ruta a redirigir
  redirectionPath = "/setting/templates-variables-index";
  @Input() breadcrumbOn = [
    { name: "Configuración", route: "/setting" },
    { name: "Variables de plantilla", route: "setting/templates-variables-index" },
  ];
  @Input() breadcrumbRouteActive = "Crear";
  iconMenu = "save";
  authorization: string;
  formGroup: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public sweetAlertService: SweetAlertService,
    private lhs: LocalStorageService,
    private restService: RestService,
    private globalAppService: GlobalAppService
  ) {
    this.formGroup = this.formBuilder.group({
      nombreCgPlantillaVariable: new UntypedFormControl(
        "",
        Validators.compose([Validators.required, Validators.pattern(/^([${]+)([0-9a-zA-Z]+)([}])$/)])
      ),
      descripcionCgPlantillaVariable: new UntypedFormControl("", Validators.compose([Validators.required])),
    });
  }

  ngOnInit() {
    this.getTokenLS();
  }

  getTokenLS() {
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;

      if (this.paramUrlId > 0) {
        this.onSearchId(this.paramUrlId, this.authorization);
      }
    });
  }

  onSearchId(id, authorization) {
    this.sweetAlertService.sweetLoading();

    const params = {
      id: this.paramUrlId,
    };
    this.restService
      .restGetParams(
        `${environment.versionApiDefault}configuracionApp/cg-plantilla-variables/index-one`,
        params,
        authorization
      )
      .subscribe(
        (responseService: ResponseServiceData) => {
          this.globalAppService.resolveResponse(responseService, true, this.redirectionPath).then((responseGlobal) => {
            if (responseGlobal == true) {
              this.formGroup.controls["nombreCgPlantillaVariable"].setValue(
                responseService.data.nombreCgPlantillaVariable
              );
              this.formGroup.controls["descripcionCgPlantillaVariable"].setValue(
                responseService.data.descripcionCgPlantillaVariable
              );
            }

            this.sweetAlertService.sweetClose();
          });
        },
        (err) => this.globalAppService.resolveResponseError(err, true, this.redirectionPath)
      );
  }

  submitmoduleForm() {
    if (this.formGroup.valid) {
      this.submitFormEmit.emit(this.formGroup.value);
    } else {
      this.sweetAlertService.sweetInfo("Algo está mal", "");
    }
  }

  menuPrimaryReceiveData() {
    const buttonSubmit = <HTMLFormElement>document.getElementById("sendForm");
    buttonSubmit.click();
  }
}
