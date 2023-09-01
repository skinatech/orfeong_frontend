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
import { Router, ActivatedRoute } from "@angular/router";
import { ConvertParamsBase64Helper } from "src/app/helpers/convert-params-base64.helper";

@Component({
  selector: "app-settings-app-tem-variables-update",
  templateUrl: "./settings-app-tem-variables-update.component.html",
  styleUrls: ["./settings-app-tem-variables-update.component.css"],
})
export class SettingsAppTemVariablesUpdateComponent implements OnInit {
  // Autorizacion de localstorage
  authorization: string;
  redirectionPath = "/setting/templates-variables-index";
  breadcrumbOn = [
    { name: "Configuración", route: "/setting" },
    { name: "Variables de plantilla", route: "setting/templates-variables-index" },
  ];
  breadcrumbRouteActive = "Actualizar";
  paramUrlId: string;

  constructor(
    public sweetAlertService: SweetAlertService,
    public lhs: LocalStorageService,
    public restService: RestService,
    public globalAppService: GlobalAppService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const paramUrlId = this.route.snapshot.paramMap.get("id");
    // Se pasa al html como componete para que reciba el ID
    this.paramUrlId = ConvertParamsBase64Helper(paramUrlId);
  }

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

    const dataUpdate = { id: Number(this.paramUrlId), data: data };
    this.restService
      .restPost(
        `${environment.versionApiDefault}configuracionApp/cg-plantilla-variables/update`,
        dataUpdate,
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
