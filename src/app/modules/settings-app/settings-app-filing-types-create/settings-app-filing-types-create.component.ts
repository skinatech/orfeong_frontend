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
import { SweetAlertService } from "../../../services/sweet-alert.service";
import { RestService } from "../../../services/rest.service";
import { environment } from "src/environments/environment";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { Router, ActivatedRoute } from "@angular/router";
import { GlobalAppService } from "src/app/services/global-app.service";

@Component({
  selector: "app-settings-app-filing-types-create",
  templateUrl: "./settings-app-filing-types-create.component.html",
  styleUrls: ["./settings-app-filing-types-create.component.css"],
})
export class SettingsAppFilingTypesCreateComponent implements OnInit {
  authorization: string;
  // Nombre del boton
  textButtonForm = "Crear";
  // Nombre del formulario
  textFormRol = "Nuevo tipo de radicado";
  // Ruta a redirigir
  redirectionPath = "/setting/filing-types-index";
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { name: "Configuración", route: "/setting" },
    { name: "Tipos de radicado", route: this.redirectionPath },
  ];
  breadcrumbRouteActive = "Crear";

  /**
   * Configuraciones para los servicios
   */
  responseServiceFormSubmit: any;
  responseServiceFormSubmitErr: any;
  urlParamTypeResolutions: string;

  constructor(
    public sweetAlertService: SweetAlertService,
    public restService: RestService,
    public lhs: LocalStorageService,
    private router: Router,
    public globalAppService: GlobalAppService,
    private route: ActivatedRoute
  ) {
    this.urlParamTypeResolutions = this.route.snapshot.paramMap.get("typeResolutions");
  }

  ngOnInit() {
    // Hace el llamado del token
    this.getTokenLS();
  }

  submitFormReceive(data) {
    /**
     * Cargando true
     */
    this.sweetAlertService.sweetLoading();
    let versionApi = environment.versionApiDefault;

    this.restService
      .restPost(versionApi + "configuracionApp/tipos-radicados/create", data, this.authorization)
      .subscribe(
        (res) => {
          this.responseServiceFormSubmit = res;
          // Evaluar respuesta del servicio
          this.globalAppService.resolveResponse(this.responseServiceFormSubmit, false).then((res) => {
            let responseResolveResponse = res;
            if (responseResolveResponse == true) {
              // Guarda en el local storage el mensaje
              localStorage.setItem("setFlashText", this.responseServiceFormSubmit.message);
              // Redirecciona a la pagina principal
              this.router.navigate([this.redirectionPath]);
              // Cargando false
              this.sweetAlertService.sweetClose();
            }
          });
        },
        (err) => {
          this.responseServiceFormSubmitErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.responseServiceFormSubmitErr, false).then((res) => {});
        }
      );
  }

  // Método para obtener el token que se encuentra encriptado en el local storage
  getTokenLS() {
    // Se consulta si el token se envió como input //
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
    });
  }
}
