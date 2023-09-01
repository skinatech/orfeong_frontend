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
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { FloatingButtonService } from "src/app/services/floating-button.service";

@Component({
  selector: "app-settings-app-filing-types-index",
  templateUrl: "./settings-app-filing-types-index.component.html",
  styleUrls: ["./settings-app-filing-types-index.component.css"],
})
export class SettingsAppFilingTypesIndexComponent implements OnInit {
  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderIcon = "description";
  initCardHeaderTitle = "Listado de tipos de radicado";
  // Nombre del módulo donde se esta accediendo al initialList
  route: string = "Setting";
  /** Formulario index */
  initBotonCreateRoute: string = "/setting/filing-types-create"; // Ruta del botón crear
  initBotonUpdateRoute: string = "/setting/filing-types-update"; // Ruta editar
  initBotonViewRoute: string = "/setting/filing-types-view"; // Ruta ver
  //initBtnVersioningIndexteRoute: string = '/setting/version-trd-index'; // Ruta Index de versionamiento
  /** BreadcrumbOn  */
  breadcrumbOn = [{ name: "Configuración", route: "/setting" }];
  breadcrumbRouteActive = "Tipos de radicado";

  // Configuraciones para datatables
  routeLoadDataTablesService: string = environment.versionApiDefault + "configuracionApp/tipos-radicados/index";
  // Configuración para el proceso change status
  routeChangeStatus: string = environment.versionApiDefault + "configuracionApp/tipos-radicados/change-status";
  dataInitialListReturn = [
    { name: "resolucionesCgGeneral" },
    { name: "resolutionExists" },
    { name: "resolucionesIdCgGeneral" },
  ];

  dtTitles: any = [
    { title: "Código de tipo radicado", data: "codigoCgTipoRadicado" },
    { title: "Nombre de tipo radicado", data: "nombreCgTipoRadicado" },
    { title: "Fecha de creación", data: "creacionCgTipoRadicado" },
  ];
  /** Fin Configuraciones para datatables */
  /** Fin Initial List */

  /**
   * Configuración para el botón flotante
   */
  menuButtonsSelectNull: any = [{ icon: "add", title: "Agregar", action: "add", data: "" }];
  menuButtonsSelectOne: any = [
    { icon: "add", title: "Agregar", action: "add", data: "" },
    { icon: "edit", title: "Editar", action: "edit", data: "" },
    { icon: "remove_red_eye", title: "Ver", action: "view", data: "" },
    { icon: "autorenew", title: "Cambiar estado", action: "changeStatus", data: "" },
  ];
  menuButtonsSelectMasive: any = [
    { icon: "add", title: "Agregar", action: "add", data: "" },
    { icon: "autorenew", title: "Cambiar estado", action: "changeStatus", data: "" },
  ];

  showButtonFiltrer: boolean = true;

  /** Variable que controla botón flotante */
  menuButtons: any = this.menuButtonsSelectNull;
  eventClickButtonSelectedData: any;
  resolucionesCgGeneral: string;
  resolutionExists: boolean;
  resolucionesIdCgGeneral: number;
  isResolutions = "false";

  constructor(private router: Router, private floatingButtonService: FloatingButtonService) {}

  ngOnInit() {}

  /**
   *
   * @param event
   * Procesando las opciones del menu flotante
   */
  menuReceiveData(event) {
    switch (event.action) {
      case "add":
        this.router.navigate([`/${this.initBotonCreateRoute}/false`]);
        break;
      case "edit":
        this.router.navigate([
          `/${this.initBotonUpdateRoute}/${this.eventClickButtonSelectedData[0]["data"][0]}/${this.isResolutions}`,
        ]);
        break;
      case "view":
        this.router.navigate([
          `/${this.initBotonViewRoute}/${this.eventClickButtonSelectedData[0]["data"][0]}/${this.isResolutions}`,
        ]);
        break;
      case "changeStatus":
        this.floatingButtonService.changeStatus(this.eventClickButtonSelectedData);
        break;
      case "typeResolutions":
        this.router.navigate([`/${this.initBotonCreateRoute}/true`]);
        break;
    }
  }

  /**
   *
   * @param event
   * Recibe la data de los registros a lo que se les hizo clic
   */
  selectedRowsReceiveData(event) {
    if (event.length > 0) {
      if (event.length == 1) {
        // Un registro seleccionado
        this.eventClickButtonSelectedData = event;
        this.menuButtons = this.menuButtonsSelectOne;
        if (event[0]["id"] === this.resolucionesIdCgGeneral) {
          this.isResolutions = "true";
        }
      } else {
        // Varios registros seleccionados
        this.menuButtons = this.menuButtonsSelectMasive;
      }
    } else {
      // Ningun registro seleccionado
      this.menuButtons = this.menuButtonsSelectNull;
    }
  }

  dataIndexReturn(event) {
    console.log(event);
    event.forEach((element) => {
      if (element["name"] === "resolucionesCgGeneral") {
        this.resolucionesCgGeneral = element["value"];
      }

      if (element["name"] === "resolutionExists") {
        this.resolutionExists = element["value"];
      }

      if (element["name"] === "resolucionesIdCgGeneral") {
        this.resolucionesIdCgGeneral = element["value"];
      }
    });

    if (this.resolucionesCgGeneral && !this.resolutionExists) {
      this.menuButtonsSelectNull.push({ icon: "wysiwyg", title: "Resoluciones", action: "typeResolutions", data: "" });
      this.menuButtonsSelectOne.push({ icon: "wysiwyg", title: "Resoluciones", action: "typeResolutions", data: "" });
      this.menuButtonsSelectMasive.push({
        icon: "wysiwyg",
        title: "Resoluciones",
        action: "typeResolutions",
        data: "",
      });
    }
  }
}
