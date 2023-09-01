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

import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { MatDialog } from "@angular/material/dialog";
import { SendMailComponent } from "../../components/send-mail/send-mail.component";

@Component({
  selector: "app-query-old-orfeo-index",
  templateUrl: "./query-old-orfeo-index.component.html",
  styleUrls: ["./query-old-orfeo-index.component.css"],
})
export class QueryOldOrfeoIndexComponent implements OnInit {
  /** Initial List */
  initCardHeaderStatus = true;
  initCardHeaderIcon = "description";
  initCardHeaderTitle = "Listado de radicados";
  // Nombre del módulo donde se esta accediendo al initialList
  route: string = "QueryOldOrfeo";
  // Autorizacion de localstorage
  authorization: string;
  // Version api
  versionApi = environment.versionApiDefault;
  // Ruta a redirigir
  redirectionPath = "/query/query-old-orfeo";
  /** Formulario index */
  initBtnVersioningIndexteRoute: string = this.redirectionPath; // Ruta Index de versionamiento
  viewColumStatus = false; // Oculta la columna de status del initial list
  /** BreadcrumbOn  */
  breadcrumbOn = [{ name: "Consulta", route: "/query" }];
  breadcrumbRouteActive = "Consulta orfeo antiguo";
  // Configuraciones para datatables
  routeLoadDataTablesService: string = this.versionApi + "radicacion/consultas-orfeo-antiguo/index";

  dtTitles: any = [
    { title: "Número de Radicado", data: "numeroRadicado" },
    { title: "Fecha de radicación", data: "fechaRadicacion" },
    { title: "Asunto de radicado", data: "asuntoRadicado" },
    { title: "Número Guia", data: "radiNumeGuia" },
    { title: "Número de expediente", data: "numeroExpediente" },
    { title: "Nombre de expediente", data: "nombreExpediente" },
    { title: "Remitente / Destinatario", data: "remitenteDestinatario" },
    { title: "Documento de Identidad", data: "documentoIdentidad" },
    { title: "Nombre dependencia radicadora", data: "identificacionDependenciaRadicadora" },
    { title: "Usuario radicador	", data: "usuarioRadicador" },
    { title: "Dependencia actual", data: "dependenciaActual" },
    { title: "Usuario actual", data: "usuarioActual" },
    { title: "Tipo documental", data: "tipoDocumental" },
  ];
  /**
   * Configuración para el botón flotante
   */
  menuButtonsSelectNull = [];
  menuButtonsSelectOne = [
    { icon: "remove_red_eye", title: "Ver", action: "view", data: "" },
    { icon: "email", title: "Envío por correo", action: "send-mail", data: "" },
  ];

  /** Variable que controla botón flotante */
  menuButtons: any = this.menuButtonsSelectNull;
  eventClickButtonSelectedData = [];

  constructor(private router: Router, public dialog: MatDialog) {
    this.eventClickButtonSelectedData = [];
  }

  ngOnInit() {}

  selectedRowsReceiveData(event) {
    this.eventClickButtonSelectedData = event;

    this.menuButtons = this.menuButtonsSelectNull;
    if (event.length > 0) {
      if (event.length === 1) {
        this.menuButtons = this.menuButtonsSelectOne;
      } else {
        this.menuButtons = this.menuButtonsSelectNull;
      }
    }
  }

  menuReceiveData(event) {
    switch (event.action) {
      case "view":
        this.router.navigate([`/query/query-old-orfeo-view/${this.eventClickButtonSelectedData[0]["data"][0]}`]);
        break;
      case "send-mail":
        const data = {
          id: this.eventClickButtonSelectedData[0]["data"][0],
        };
        this.openDialog(SendMailComponent, "95%", data);
        break;
    }
  }

  openDialog(file, width, data) {
    const dialogRef = this.dialog.open(file, {
      disableClose: true,
      width: width,
      data: data,
    });
    dialogRef.afterClosed().subscribe(() => {});
  }
}
