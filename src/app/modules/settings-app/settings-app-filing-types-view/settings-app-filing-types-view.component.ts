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
import { ConvertParamsBase64Helper } from "src/app/helpers/convert-params-base64.helper";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { SweetAlertService } from "src/app/services/sweet-alert.service";
import { RestService } from "src/app/services/rest.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-settings-app-filing-types-view",
  templateUrl: "./settings-app-filing-types-view.component.html",
  styleUrls: ["./settings-app-filing-types-view.component.css"],
})
export class SettingsAppFilingTypesViewComponent implements OnInit {
  // Autorizacion de localstorage
  authorization: string;
  // variable que guarda el id que llega por Get
  paramiD: string;
  paramOID: string;
  // Nombre del formulario
  textFormView = "Detalle del tipo de radicado"; // i18n
  /** Datos que solicita el ViewList */
  // Ruta a consultar en el ViewList
  reuteLoadView: string = "configuracionApp/tipos-radicados/view";
  // Ruta a actualizar en el ViewList
  routeBotonUpdateView: string = "/setting/filing-types-update/";
  // Icono del ViewList
  initCardHeaderIcon = "description";
  // Ruta a redirigir
  redirectionPath = "/setting/filing-types-index";
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { name: "Configuración", route: "/setting" },
    { name: "Tipos de radicado", route: this.redirectionPath },
  ];
  breadcrumbRouteActive = "Detalles";

  checkListAcordeon: boolean = true;
  checkListAcordeonCardHeaderIcon: string = "description";
  checkListAcordeonTexForm: string = "Transacciones asociadas al tipo de radicado";

  /**
   * Configuración para el botón flotante
   */
  iconMenu: string = "edit";

  constructor(
    private route: ActivatedRoute,
    public lhs: LocalStorageService,
    public sweetAlertService: SweetAlertService,
    public restService: RestService,
    private router: Router
  ) {
    this.paramiD = this.route.snapshot.paramMap.get("id"); // SE recibe el id
    this.paramOID = ConvertParamsBase64Helper(this.paramiD); // Se pasa al html como componete para que reciba el ID
    this.routeBotonUpdateView = this.routeBotonUpdateView + this.paramiD;
  }

  ngOnInit() {}

  menuPrimaryReceiveData(event) {
    this.router.navigate(["/" + this.routeBotonUpdateView]);
  }
}
