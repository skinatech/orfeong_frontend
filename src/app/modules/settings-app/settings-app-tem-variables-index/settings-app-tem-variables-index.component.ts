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
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import { FloatingButtonService } from "src/app/services/floating-button.service";

@Component({
  selector: "app-settings-app-tem-variables-index",
  templateUrl: "./settings-app-tem-variables-index.component.html",
  styleUrls: ["./settings-app-tem-variables-index.component.css"],
})
export class SettingsAppTemVariablesIndexComponent implements OnInit {
  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderIcon = "mark_chat_read";
  initCardHeaderTitle = "Listado variables de plantilla";
  showButtonFiltrer = false; // Oculta el boton de filtros
  // Nombre del módulo donde se esta accediendo al initialList
  route: string = "TemplateVariables";
  // Autorizacion de localstorage
  authorization: string;
  // Version api
  versionApi = environment.versionApiDefault;
  // Ruta a redirigir
  redirectionPath = "/setting/providers-index";
  /** Formulario index */
  /** Formulario index */
  initBotonCreateRoute: string = ""; // Ruta del botón crear
  initBotonUpdateRoute: string = ""; // Ruta editar
  initBotonViewRoute: string = ""; // Ruta ver
  initBtnVersioningIndexteRoute: string = this.redirectionPath; // Ruta Index de versionamiento
  /** BreadcrumbOn  */
  breadcrumbOn = [{ name: "Configuración", route: "/setting" }];
  breadcrumbRouteActive = "Variables plantillas";
  // Configuraciones para datatables
  routeLoadDataTablesService: string = environment.versionApiDefault + "configuracionApp/cg-plantilla-variables/index";
  // Configuración para el proceso change status
  routeChangeStatus: string = environment.versionApiDefault + "configuracionApp/cg-plantilla-variables/change-status";

  dtTitles: any = [
    { title: "Nombre variable", data: "nombreCgPlantillaVariable" },
    { title: "Descripción", data: "descripcionCgPlantillaVariable" },
    { title: "Fecha creación", data: "createdate" },
  ];
  /** Fin Configuraciones para datatables */

  /** Variables para la notificacion inicial (variables seran traducidas) */
  initialNotificationStatus: boolean = true;
  initialNotificationMessage: string = "initialNotificationTemplatesVariables";
  initialNotificationMessageArray: any = [
    "initialNotificationTemplatesVariablesArray.0",
    "initialNotificationTemplatesVariablesArray.1",
    "initialNotificationTemplatesVariablesArray.2",
    "initialNotificationTemplatesVariablesArray.3",
  ];

  /** Fin Initial List */

  /**
   * Configuración para el botón flotante
   */
  menuButtonsSelectNull: any = [{ icon: "add", title: "Agregar", action: "add", data: "" }];
  menuButtonsSelectOne: any = [
    { icon: "add", title: "Agregar", action: "add", data: "" },
    { icon: "edit", title: "Editar", action: "edit", data: "" },
    { icon: "autorenew", title: "Cambiar estado", action: "changeStatus", data: "" },
  ];
  menuButtonsSelectMasive: any = [{ icon: "add", title: "Agregar", action: "add", data: "" }];

  /** Variable que controla botón flotante */
  menuButtons: any = this.menuButtonsSelectNull;
  eventClickButtonSelectedData: any;

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
        this.router.navigate(["/setting/templates-variables-create"]);
        break;
      case "edit":
        this.router.navigate([
          `/setting/templates-variables-update/${this.eventClickButtonSelectedData[0]["data"][0]}`,
        ]);
        break;
      case "changeStatus":
        this.floatingButtonService.changeStatus(this.eventClickButtonSelectedData);
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
      } else {
        // Varios registros seleccionados
        this.menuButtons = this.menuButtonsSelectMasive;
      }
    } else {
      // Ningun registro seleccionado
      this.menuButtons = this.menuButtonsSelectNull;
    }
  }
}
