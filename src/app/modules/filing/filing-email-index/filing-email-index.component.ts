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

import { AuthService } from "src/app/services/auth.service";

import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ActivateTranslateService } from "../../../services/activate-translate.service";
import { RestService } from "../../../services/rest.service";
import { LocalStorageService } from "../../../services/local-storage.service";
import { SweetAlertService } from "../../../services/sweet-alert.service";
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, Validators } from "@angular/forms";
import { ChangeChildrenService } from "../../../services/change-children.service";
import { Subscription } from "rxjs/internal/Subscription";

@Component({
  selector: "app-filing-email-index",
  templateUrl: "./filing-email-index.component.html",
  styleUrls: ["./filing-email-index.component.css"],
})
export class FilingEmailIndexComponent implements OnInit, OnDestroy {
  breadcrumbOn = [{ name: "Radicación", route: "/filing" }];

  breadcrumbRouteActive = "Radicación email";
  /** Formulario index */
  initBotonCreateRoute: string = "/filing/filing-create"; // Ruta del botón crear
  initBotonUpdateRoute: string = "/filing/filing-update"; // Ruta editar usuario
  initBotonViewRoute: string = "/filing/filing-view"; // Ruta ver usuario

  /** Initial List */
  initialListStatus = false;
  initCardHeaderStatus = true;
  initCardHeaderIcon = "contact_mail";
  initCardHeaderTitle = "Listado de correos";
  viewColumStatus = false;

  /** Nombre del módulo donde se esta accediendo al initialList */
  redirectionPath: string = "/filing/filing-email-index";
  route: string = "/filing/filing-email-index";

  // Configuraciones para datatables
  routeLoadDataTablesService: string = environment.versionApiDefault + "radicacion/radicacion-email/receiving-mail";
  // Configuración para el proceso change status
  routeChangeStatus: string = environment.versionApiDefault + "radicacion/radicacion-email/receiving-mail";

  dtTitles: any = [
    { title: "Bandeja", data: "mailBoxName" },
    { title: "De", data: "NameAndAddress" },
    { title: "Asunto", data: "subject" },
    { title: "Fecha envío", data: "date" },
    { title: "Adjuntos", data: "hasAttachment" },
    { title: "Correo radicado", data: "isCorreoRadicado" },
  ];

  /**
   * Configuración para el botón flotante
   */
  menuButtonsSelectNull: any = [
    { icon: "pageview", title: "Consultar últimos dos días", action: "getLast2Days", data: "" },
    { icon: "exit_to_app", title: "Cerrar sesión", action: "closeMailSession", data: "" },
  ];

  menuButtonsSelectOne: any = [
    { icon: "remove_red_eye", title: "Ver", action: "view", data: "" },
    { icon: "add", title: "Radicar correos seleccionados", action: "add", data: "" },
    { icon: "pageview", title: "Consultar últimos dos días", action: "getLast2Days", data: "" },
    { icon: "exit_to_app", title: "Cerrar sesión", action: "closeMailSession", data: "" },
  ];

  menuButtonsSelectMasive: any = [
    { icon: "add", title: "Radicar correos seleccionados", action: "add", data: "" },
    { icon: "pageview", title: "Consultar últimos dos días", action: "getLast2Days", data: "" },
    { icon: "exit_to_app", title: "Cerrar sesión", action: "closeMailSession", data: "" },
  ];
  menuButtonsSelectMasive2: any = [
    { icon: "pageview", title: "Consultar últimos dos días", action: "getLast2Days", data: "" },
    { icon: "exit_to_app", title: "Cerrar sesión", action: "closeMailSession", data: "" },
  ]; // Utilizado cuando todos los remitentes de los correos seleccionados no son iguales

  /** Variable que controla botón flotante */
  menuButtons: any = this.menuButtonsSelectNull;
  eventClickButtonSelectedData: any;
  resSerFormSubmit: any;
  resSerFormSubmitErr: any;

  /** Variables de sesion usuario */
  moduleEmail: boolean = true;
  mailBox: string = environment.mailbox;
  countMailIds: number = 0; // Cantidad de correos según criteria
  countMailProcessed: number = 0; // Cantidad de correos procesados
  countMailNoProcessed: number = 0; // Cantidad de correos NO procesados
  radicacionEmail: boolean = true;
  dataHashMailSkina: any;

  activeLang: string;
  languageReceive: any;
  subscriptionTranslateService$: Subscription;

  /** Variables para view content */
  statusViewContent: boolean = false;
  dataViewContent: any = {};

  authorization: string;

  moduleFormInitial: UntypedFormGroup;

  informedSameEmailSender: boolean = false;

  constructor(
    private router: Router,
    public sweetAlertService: SweetAlertService,
    private authService: AuthService,
    public restService: RestService,
    private lhs: LocalStorageService,
    private translate: TranslateService,
    private activateTranslateService: ActivateTranslateService,
    private formBuilder: UntypedFormBuilder,
    private changeChildrenService: ChangeChildrenService
  ) {
    /** Idioma inical */
    this.detectLanguageInitial();

    /** Formulario para evaluar cambios desde el initial list */
    this.moduleFormInitial = this.formBuilder.group({
      countCallsDatatablesInit: new UntypedFormControl(0, Validators.compose([])),
    });
  }

  ngOnInit() {
    /** Detectando si se ejecuta cambio de idioma */
    this.detectLanguageChange();

    let dataLocalStorage = localStorage.getItem(environment.hashMailSkina);

    if (dataLocalStorage == null) {
      this.router.navigate(["/filing/filing-email-login"]);
    } else {
      this.initialListStatus = true;
    }
  }

  /** Método para obtener el token que se encuentra encriptado en el local storage */
  getTokenLS() {
    /** Se consulta solo si el token no se recibió como Input() */
    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
    });
  }

  /**
   *
   * @param event
   * Procesando las opciones del menu flotante
   */
  public menuReceiveData(event) {
    switch (event.action) {
      case "add":
        this.changeChildrenService.requestToModal({ proccess: "close" });
        this.goFilingCreate();
        break;
      case "view":
        this.dataViewContent = this.eventClickButtonSelectedData[0];
        this.openViewContent();
        break;
      case "closeMailSession":
        this.changeChildrenService.requestToModal({ proccess: "close" });
        this.closeMailSession();
        break;
      case "getLast2Days":
        this.changeChildrenService.requestToModal({ proccess: "close" });
        this.getLast2Days();
        break;
    }
  }

  getLast2Days() {
    let contador = this.moduleFormInitial.controls["countCallsDatatablesInit"].value + 1;
    this.moduleFormInitial.controls["countCallsDatatablesInit"].setValue(contador);
  }

  changeDataMailRecibe(event) {
    this.informedSameEmailSender = false;

    this.mailBox = event.mailBox;
    this.processInfoMailCount(event.infoMailCount);
  }

  /** Función que procesa los datos de las cantidades de correo consultadas */
  processInfoMailCount(infoMailCount) {
    this.countMailIds = infoMailCount.countMailIds;
    this.countMailProcessed = infoMailCount.countMailProcessed;
    this.countMailNoProcessed = infoMailCount.countMailNoProcessed;

    if (this.countMailIds != this.countMailProcessed + this.countMailNoProcessed) {
      this.sweetAlertService.showNotification(
        "warning",
        this.translate.instant("messageCountEmails.a") +
          this.countMailProcessed +
          this.translate.instant("messageCountEmails.b") +
          this.countMailIds +
          this.translate.instant("messageCountEmails.c")
      );
    }
  }

  /** Funcion para redireccionar a la creacion de radicado */
  goFilingCreate() {
    // Obtener la informacion de la radicacion mail desde el localStorage
    this.dataHashMailSkina = this.authService.decryptAES(localStorage.getItem(environment.hashMailSkina));

    // Guardar los datos adicionales en el localStorage
    (this.dataHashMailSkina.mailBox = this.mailBox),
      (this.dataHashMailSkina.dataEmail = this.eventClickButtonSelectedData);
    let hashMailSkina = this.authService.encryptAES(this.dataHashMailSkina);
    localStorage.setItem(environment.hashMailSkina, hashMailSkina);

    // Procesa el parametro y enviarlo por get a la creacion de radicado
    let param = btoa(hashMailSkina);
    param = param.replace(/_/g, "/");
    param = param.replace(/-/g, "+");

    this.validateselectedData(this.dataHashMailSkina.dataEmail).then(
      (resp) => {
        this.router.navigate(["/" + this.initBotonCreateRoute + "/" + param]);
      },
      (err) => {
        let errors = {
          error: [this.translate.instant("sameEmailSender")],
        };
        this.sweetAlertService.sweetInfo("Algo está mal", errors);
      }
    );
  }

  /**
   * Funcion para procesar la data seleccionada
   * La promesa retorna reject() cuando encuentra algun correo diferente a los demas en la lista
   */
  validateselectedData(dataSelected: any[]) {
    return new Promise<any>((resolve, reject) => {
      let countData = dataSelected.length;
      let correoOld = null;
      let i = 0;
      dataSelected.forEach((element) => {
        i++;
        if (correoOld != element.fromAddress && i != 1) {
          if (!this.informedSameEmailSender) {
            this.sweetAlertService.showNotification("warning", this.translate.instant("sameEmailSender"));
            this.informedSameEmailSender = true;
          }
          reject();
        } else {
          if (countData == i) {
            resolve(true);
          }
        }
        correoOld = element.fromAddress;
      });
    });
  }

  /** Funcion que recibe la data seleccionada para definir si muestra el boton de radicacion */
  validateMenuButtonsSelectMasive(dataSelected) {
    this.validateselectedData(dataSelected).then(
      (resp) => {
        this.menuButtons = this.menuButtonsSelectMasive;
      },
      (err) => {
        this.menuButtons = this.menuButtonsSelectMasive2;
      }
    );
  }

  /**
   *
   * @param event
   * Recibe la data de los registros a lo que se les hizo clic
   */
  selectedRowsReceiveData(event) {
    /** Armar Boton flotante **/
    if (event.length > 0) {
      if (event.length == 1) {
        // Un registro seleccionado
        this.eventClickButtonSelectedData = event;
        this.menuButtons = this.menuButtonsSelectOne;
      } else {
        // Varios registros seleccionados
        this.menuButtons = this.menuButtonsSelectMasive;
        this.validateMenuButtonsSelectMasive(event);
      }
    } else {
      // Ningun registro seleccionado
      this.menuButtons = this.menuButtonsSelectNull;
    }
  }

  /** Abre el componente view */
  openViewContent() {
    this.statusViewContent = true;
  }

  /** Cerrar o desdruir componente de filtros */
  closeViewContent(respuesta) {
    this.statusViewContent = false;
    this.informedSameEmailSender = false;
  }

  detectLanguageInitial() {
    if (localStorage.getItem("language")) {
      this.activeLang = localStorage.getItem("language");
    } else {
      this.activeLang = "es";
    }
    this.translate.setDefaultLang(this.activeLang);
  }

  detectLanguageChange() {
    this.subscriptionTranslateService$ = this.activateTranslateService.activateLanguageChange.subscribe((language) => {
      this.languageReceive = language;
      this.translate.setDefaultLang(this.languageReceive);
    });
  }

  closeMailSession() {
    localStorage.removeItem(environment.hashMailSkina);
    localStorage.removeItem(environment.hashMailInitialListSkina);
    this.router.navigate(["/filing/filing-email-login"]);
  }

  ngOnDestroy() {
    if (!!this.subscriptionTranslateService$) this.subscriptionTranslateService$.unsubscribe();
  }
}
