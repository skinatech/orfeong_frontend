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
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, Validators } from "@angular/forms";
import { RestService } from "src/app/services/rest.service";
import { GlobalAppService } from "src/app/services/global-app.service";
import { SweetAlertService } from "src/app/services/sweet-alert.service";
import { environment } from "src/environments/environment";
import { ConvertParamsBase64Helper } from "src/app/helpers/convert-params-base64.helper";
import { LocalStorageService } from "src/app/services/local-storage.service";

@Component({
  selector: "app-send-mail",
  templateUrl: "./send-mail.component.html",
  styleUrls: ["./send-mail.component.css"],
})
export class SendMailComponent implements OnInit {
  formGroup: UntypedFormGroup;
  emailsStorage: Array<string>;
  showMsgErr = false;
  showMsgErrVal: string;
  emailValue = "";
  arrayDocuments = [];
  idRow: string;
  authorization: string;
  selectedRows = [];

  constructor(
    public dialogRef: MatDialogRef<SendMailComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: { id: string },
    private formBuilder: UntypedFormBuilder,
    private restService: RestService,
    private globalAppService: GlobalAppService,
    private sweetAlertService: SweetAlertService,
    private lhs: LocalStorageService
  ) {
    this.formGroup = this.formBuilder.group({
      emails: new UntypedFormControl(),
      mailBody: new UntypedFormControl("", Validators.compose([Validators.required])),
    });
    this.emailsStorage = [];
    this.idRow = ConvertParamsBase64Helper(this.dialogData.id);
  }

  ngOnInit() {
    this.getTokenLS();
  }

  getTokenLS() {
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
      this.getDocuments(res);
    });
  }

  keydownEnter(event) {
    const validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    if (validEmail.test(event)) {
      const findEmail = this.emailsStorage.find((element) => element === event);
      if (findEmail) {
        this.showMsgErr = true;
        this.showMsgErrVal = "El correo ya existe";
      } else {
        this.emailsStorage.push(event);
        this.showMsgErr = false;
        this.formGroup.controls["emails"].reset();
      }
    } else {
      this.showMsgErr = true;
      this.showMsgErrVal = "El correo no es valido";
    }
  }

  deleteEmail(event) {
    const filterEmail = this.emailsStorage.filter((element) => element !== event);
    this.emailsStorage = filterEmail;
  }

  submitForm() {
    if (this.formGroup.valid) {
      if (this.emailsStorage.length === 0) {
        this.showMsgErr = true;
        this.showMsgErrVal = "Se deben ingresar al menos un correo";
      } else {
        const data = {
          id: this.idRow,
          emails: this.emailsStorage,
          bodyMail: this.formGroup.controls["mailBody"].value,
          documents: this.selectedRows,
        };
        this.sweetAlertService.sweetLoading();

        this.restService
          .restPost(
            `${environment.versionApiDefault}radicacion/consultas-orfeo-antiguo/enviar-correo`,
            data,
            this.authorization
          )
          .subscribe(
            (responseApi) => {
              this.globalAppService.resolveResponse(responseApi, false).then((responseGlobal) => {
                if (responseGlobal) {
                  this.sweetAlertService.showNotification("success", responseApi.message);
                  this.closeDialog();
                }
              });

              this.sweetAlertService.sweetClose();
            },
            (err) => this.globalAppService.resolveResponseError(err)
          );
      }
    }
  }

  getDocuments(authorization) {
    const params = {
      id: this.idRow,
    };
    this.sweetAlertService.sweetLoading();

    this.restService
      .restGetParams(
        `${environment.versionApiDefault}radicacion/consultas-orfeo-antiguo/index-documentos`,
        params,
        authorization
      )
      .subscribe(
        (responseApi) => {
          this.globalAppService.resolveResponse(responseApi, false).then((responseGlobal) => {
            if (responseGlobal) {
              this.arrayDocuments = responseApi.data;
            }
          });

          this.sweetAlertService.sweetClose();
        },
        (err) => this.globalAppService.resolveResponseError(err)
      );
  }

  clickRow(data) {
    if (this.arrayDocuments[data.index]["rowSelect"] == true) {
      this.arrayDocuments[data.index]["rowSelect"] = false;

      let indexSearch = this.selectedRows.indexOf(this.arrayDocuments[data.index]);
      this.selectedRows.splice(indexSearch, 1);
    } else {
      this.arrayDocuments[data.index]["rowSelect"] = true;
      this.arrayDocuments[data.index]["idInitialList"] = data.index;

      this.selectedRows.push(this.arrayDocuments[data.index]);
    }
  }

  closeDialog() {
    this.dialogRef.close({ event: "close", status: false, data: [] });
  }
}
