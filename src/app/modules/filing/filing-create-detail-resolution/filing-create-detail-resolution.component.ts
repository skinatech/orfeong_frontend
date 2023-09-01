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

import { Component, OnInit, Inject } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SweetAlertService } from "src/app/services/sweet-alert.service";
import { GlobalAppService } from "src/app/services/global-app.service";
import { RestService } from "src/app/services/rest.service";
import { DialogData, GetParamsData } from "./interfaces/filing-create-detail-resolution.interface";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-filing-create-detail-resolution",
  templateUrl: "./filing-create-detail-resolution.component.html",
  styleUrls: ["./filing-create-detail-resolution.component.css"],
})
export class FilingCreateDetailResolutionComponent implements OnInit {
  formGroup: UntypedFormGroup;
  minDate: Date;
  maxDate: Date;
  validateFormGroup = false;
  routeService: string;
  private authorization: string;
  idRadicado: string;
  redirectionPath = "/filing/filing-index/false";
  getDetailResolutionData: GetParamsData = null;
  showRowNumberResolutions = true;
  dataNumberResolution = 0;

  constructor(
    private formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData,
    public dialogRef: MatDialogRef<FilingCreateDetailResolutionComponent>,
    private restService: RestService,
    private globalAppService: GlobalAppService,
    public sweetAlertService: SweetAlertService
  ) {
    this.formGroup = this.formBuilder.group({
      idRadiRadicado: new UntypedFormControl(dialogData.idRadicado),
      idRadiRadicadoResoluciones: new UntypedFormControl("", Validators.compose([Validators.required])),
      numeroRadiRadicadoResolucion: new UntypedFormControl(),
      fechaRadiRadicadoResolucion: new UntypedFormControl("", Validators.compose([Validators.required])),
      valorRadiRadicadoResolucion: new UntypedFormControl(0),
    });

    this.idRadicado = dialogData.idRadicado;
    this.authorization = dialogData.authorization;
    this.routeService = dialogData.route.replace(/%/g, "/");
  }

  ngOnInit() {
    this.getDetailResolution();
  }

  submitForm() {
    if (this.formGroup.valid) {
      this.sweetAlertService.sweetLoading();

      const data = {
        formData: this.formGroup.value,
      };

      this.restService.restPost(this.routeService, this.formGroup.value, this.authorization).subscribe(
        (responseService) => {
          this.globalAppService.resolveResponse(responseService, false).then((responseGlobal) => {
            if (responseGlobal == true) {
              this.sweetAlertService.showNotification("success", responseService.message);
            }

            this.sweetAlertService.sweetClose();
            this.dialogRef.close({ event: "close", status: true, data: [] });
          });
        },
        (err) => this.globalAppService.resolveResponseError(err).then((res) => {})
      );
    }
  }

  getDetailResolution() {
    this.sweetAlertService.sweetLoading();

    const params = {
      idRadiRadicado: this.idRadicado,
    };

    this.restService
      .restGetParams(
        `${environment.versionApiDefault}radicacion/radicados-resoluciones/index-one`,
        params,
        this.authorization
      )
      .subscribe((responseService: GetParamsData) => {
        this.globalAppService.resolveResponse(responseService).then((responseGlobal) => {
          if (responseGlobal == true) {
            this.formGroup.controls["idRadiRadicadoResoluciones"].setValue(responseService.data.idResoluciones);
            if (responseService.data.idResoluciones > 0) {
              this.getDetailResolutionData = responseService;
              const fechaResolucion = new Date(responseService.data.fechaResolucion);
              this.formGroup.controls["numeroRadiRadicadoResolucion"].setValue(responseService.data.numeroResolucion);
              this.dataNumberResolution = responseService.data.numeroResolucion;
              this.formGroup.controls["fechaRadiRadicadoResolucion"].setValue(fechaResolucion);
              this.formGroup.controls["valorRadiRadicadoResolucion"].setValue(responseService.data.valorResolucion);
            } else {
              this.dataNumberResolution = responseService.data.numeroResolucion;
              this.formGroup.controls["numeroRadiRadicadoResolucion"].setValue(responseService.data.numeroResolucion);
            }
          }
          this.sweetAlertService.sweetClose();
        });
      });
  }

  closeDialog() {
    this.dialogRef.close({ event: "close", status: false, data: [] });
  }
}
