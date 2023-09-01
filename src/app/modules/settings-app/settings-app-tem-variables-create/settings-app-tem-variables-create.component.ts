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

import { Component, OnInit } from "@angular/core";
import { SweetAlertService } from "src/app/services/sweet-alert.service";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { RestService } from "src/app/services/rest.service";
import { environment } from "src/environments/environment";
import { GlobalAppService } from "src/app/services/global-app.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-settings-app-tem-variables-create",
  templateUrl: "./settings-app-tem-variables-create.component.html",
  styleUrls: ["./settings-app-tem-variables-create.component.css"],
})
export class SettingsAppTemVariablesCreateComponent implements OnInit {
  // Autorizacion de localstorage
  authorization: string;
  redirectionPath = "/setting/templates-variables-index";

  constructor(
    public sweetAlertService: SweetAlertService,
    public lhs: LocalStorageService,
    public restService: RestService,
    public globalAppService: GlobalAppService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getTokenLS();
  }

  getTokenLS() {
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
    });
  }

  submitFormReceive(data) {
    this.sweetAlertService.sweetLoading();

    this.restService
      .restPost(
        `${environment.versionApiDefault}configuracionApp/cg-plantilla-variables/create`,
        data,
        this.authorization
      )
      .subscribe((responseService) => {
        this.globalAppService.resolveResponse(responseService, false).then(
          (responseGlobal) => {
            if (responseGlobal == true) {
              this.sweetAlertService.showNotification("success", responseService.message);
              this.router.navigate([this.redirectionPath]);
            }

            this.sweetAlertService.sweetClose();
          },
          (err) => this.globalAppService.resolveResponseError(err, false)
        );
      });
  }
}
