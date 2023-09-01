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

import { Component, OnInit, Renderer2, ViewChild, ElementRef, Input, Output, EventEmitter } from "@angular/core";
import { ROUTES } from "../admin-aside-nav-bar/admin-aside-nav-bar.component";
import { Router, NavigationEnd } from "@angular/router";
import { Location } from "@angular/common";
import { environment } from "src/environments/environment";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { GlobalAppService } from "src/app/services/global-app.service";
import { ActivateTranslateService } from "src/app/services/activate-translate.service";
import { RestService } from "src/app/services/rest.service";
import { filter } from "rxjs/operators";
/**
 * Importación del servidor sockect
 */
import { SocketioService } from "src/app/services/socketio.service";
import { Subscription } from "rxjs/internal/Subscription";

const misc: any = {
  navbar_menu_visible: 0,
  active_collapse: true,
  disabled_collapse_init: 0,
};

declare var $: any;
@Component({
  selector: "app-admin-top-nav-bar",
  templateUrl: "./admin-top-nav-bar.component.html",
  styleUrls: ["./admin-top-nav-bar.component.css"],
})
export class AdminTopNavBarComponent implements OnInit {
  @Input() topNavBarTitle: string;
  @Input() topNavBarRouteActive: string;
  @Input() topNavBarOn: string;

  @Output() public searchEmiter = new EventEmitter<any>();

  private listTitles: any[];
  location: Location;
  mobile_menu_visible: any = 0;
  private nativeElement: Node;
  private toggleButton: any;
  private sidebarVisible: boolean;
  private _router: Subscription;
  hashSkina: any;

  /** Respuesta del servicio de consulta de usuario en localStorage */
  userData: any = {
    username: "",
    data: [],
  };
  userName: string = "Usuario"; // Usuario Logueado
  userID: number; // Usuario Logueado
  rutaMiCuenta: string = "/users/users-update/";
  rutaMiCuentaCliente: string = "/customers/customers-update/";
  initBotonFiling: string = "/filing/filing-index/open"; // Ruta index radicado
  routeFilingIndex: string = "/filing/filing-index/false"; // Ruta index radicado
  routedocumentManagementIndex: string = "/documentManagement/folder-index/false";
  initBotondocumentManagement: string = "/documentManagement/folder-index/open";
  authorization: string = ""; // Autorizacion de localstorage
  dataNotification: any = []; // Data de las notificaciones
  countNotification: number = 0; // Total de notificaciones
  idsChangeStatus: any;

  // Variables para servicios
  resSerNotification: any;
  resSerNotificationErr: any;
  resSerChangeStatusNotifi: any;
  resSerChangeStatusNotifiErr: any;

  @ViewChild("app-navbar-cmp", { static: false }) button: any;

  userIDFull: number;

  constructor(
    location: Location,
    private renderer: Renderer2,
    private element: ElementRef,
    private router: Router,
    public lhs: LocalStorageService,
    private activateTranslateService: ActivateTranslateService,
    public globalAppService: GlobalAppService,
    private socketioService: SocketioService,
    public restService: RestService
  ) {
    this.location = location;
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
  }

  logout() {
    // Cierra sesión
    this.restService.logout(this.authorization, "normal");
  }

  minimizeSidebar() {
    const body = document.getElementsByTagName("body")[0];

    if (misc.sidebar_mini_active === true) {
      body.classList.remove("sidebar-mini");
      misc.sidebar_mini_active = false;
    } else {
      setTimeout(function () {
        body.classList.add("sidebar-mini");

        misc.sidebar_mini_active = true;
      }, 300);
    }

    // we simulate the window Resize so the charts will get updated in realtime.
    const simulateWindowResize = setInterval(function () {
      window.dispatchEvent(new Event("resize"));
    }, 180);

    // we stop the simulation of Window Resize after the animations are completed
    setTimeout(function () {
      clearInterval(simulateWindowResize);
    }, 1000);
  }
  hideSidebar() {
    const body = document.getElementsByTagName("body")[0];
    const sidebar = document.getElementsByClassName("sidebar")[0];

    if (misc.hide_sidebar_active === true) {
      setTimeout(function () {
        body.classList.remove("hide-sidebar");
        misc.hide_sidebar_active = false;
      }, 300);
      setTimeout(function () {
        sidebar.classList.remove("animation");
      }, 600);
      sidebar.classList.add("animation");
    } else {
      setTimeout(function () {
        body.classList.add("hide-sidebar");
        // $('.sidebar').addClass('animation');
        misc.hide_sidebar_active = true;
      }, 300);
    }

    // we simulate the window Resize so the charts will get updated in realtime.
    const simulateWindowResize = setInterval(function () {
      window.dispatchEvent(new Event("resize"));
    }, 180);

    // we stop the simulation of Window Resize after the animations are completed
    setTimeout(function () {
      clearInterval(simulateWindowResize);
    }, 1000);
  }

  ngOnInit() {
    this.getUserLS();

    this.listTitles = ROUTES.filter((listTitle) => listTitle);

    const navbar: HTMLElement = this.element.nativeElement;
    const body = document.getElementsByTagName("body")[0];
    this.toggleButton = navbar.getElementsByClassName("navbar-toggler")[0];
    if (body.classList.contains("sidebar-mini")) {
      misc.sidebar_mini_active = true;
    }
    if (body.classList.contains("hide-sidebar")) {
      misc.hide_sidebar_active = true;
    }
    this._router = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.sidebarClose();

        const $layer = document.getElementsByClassName("close-layer")[0];
        if ($layer) {
          $layer.remove();
        }
      });
  }
  onResize(event) {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
  sidebarOpen() {
    var $toggle = document.getElementsByClassName("navbar-toggler")[0];
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName("body")[0];
    setTimeout(function () {
      toggleButton.classList.add("toggled");
    }, 500);
    body.classList.add("nav-open");
    setTimeout(function () {
      $toggle.classList.add("toggled");
    }, 430);

    var $layer = document.createElement("div");
    $layer.setAttribute("class", "close-layer");

    if (body.querySelectorAll(".main-panel")) {
      document.getElementsByClassName("main-panel")[0].appendChild($layer);
    } else if (body.classList.contains("off-canvas-sidebar")) {
      document.getElementsByClassName("wrapper-full-page")[0].appendChild($layer);
    }

    setTimeout(function () {
      $layer.classList.add("visible");
    }, 100);

    $layer.onclick = function () {
      //asign a function
      body.classList.remove("nav-open");
      this.mobile_menu_visible = 0;
      this.sidebarVisible = false;

      $layer.classList.remove("visible");
      setTimeout(function () {
        $layer.remove();
        $toggle.classList.remove("toggled");
      }, 400);
    }.bind(this);

    body.classList.add("nav-open");
    this.mobile_menu_visible = 1;
    this.sidebarVisible = true;
  }
  sidebarClose() {
    var $toggle = document.getElementsByClassName("navbar-toggler")[0];
    const body = document.getElementsByTagName("body")[0];
    this.toggleButton.classList.remove("toggled");
    var $layer = document.createElement("div");
    $layer.setAttribute("class", "close-layer");

    this.sidebarVisible = false;
    body.classList.remove("nav-open");
    // $('html').removeClass('nav-open');
    body.classList.remove("nav-open");
    if ($layer) {
      $layer.remove();
    }

    setTimeout(function () {
      $toggle.classList.remove("toggled");
    }, 400);

    this.mobile_menu_visible = 0;
  }
  sidebarToggle() {
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
  }

  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);
    }
    for (let i = 0; i < this.listTitles.length; i++) {
      if (this.listTitles[i].type === "link" && this.listTitles[i].path === titlee) {
        return this.listTitles[i].title;
      } else if (this.listTitles[i].type === "sub") {
        for (let j = 0; j < this.listTitles[i].children.length; j++) {
          let subtitle = this.listTitles[i].path + "/" + this.listTitles[i].children[j].path;
          // console.log(subtitle)
          // console.log(titlee)
          if (subtitle === titlee) {
            return this.listTitles[i].children[j].title;
          }
        }
      }
    }
    return "Dashboard";
  }

  getPath() {
    return this.location.prepareExternalUrl(this.location.path());
  }

  // Redirecciona a radicados filtro
  getSearch() {
    const url = this.getPath();
    if (url.includes(this.routeFilingIndex)) {
      this.searchEmiter.emit({ status: true });
    } else {
      this.router.navigate(["/" + this.initBotonFiling]);
    }
  }

  getSearchDocumentManagement() {
    const url = this.getPath();
    if (url.includes(this.routedocumentManagementIndex)) {
      this.searchEmiter.emit({ status: true });
    } else {
      this.router.navigate(["/" + this.initBotondocumentManagement]);
    }
  }

  /** Métodos agregados */

  /** Método para obtener los datos del usuario que se encuentra encriptado en el local storage */
  getUserLS() {
    this.lhs.getUser().then((res: any) => {
      this.userData = res;
      this.userID = this.userData.data[0];
      this.userIDFull = this.userData.idDataCliente;

      /** Definir ruta de mi cuenta del usuario logueado segun tipo de usuario */
      if (this.userData.idUserTipo == environment.tipoUsuario.Cliente) {
        this.rutaMiCuenta = this.rutaMiCuentaCliente + this.userData.idDataCliente;
      } else {
        this.setRutaMiCuenta(this.userID);
      }
      /** Fin Definir ruta de mi cuenta del usuario logueado segun tipo de usuario */
      /** Definir nombre a mostrat del usuario */
      if (this.userData.username == "") {
        this.userName = "Usuario";
      } else if (this.userData.username.length > 19) {
        this.userName = this.userData.username.substr(0, 19) + "...";
      }
      /** Fin Definir nombre a mostrat del usuario */
    });

    this.lhs.getToken().then((res: string) => {
      this.authorization = res;
      this.getNotificationUser();
    });
  }

  /** Servicio para consultar las notificaciones del usuario */
  getNotificationUser() {
    let params: any = {};
    this.restService
      .restGetParams(environment.versionApiDefault + "notificacion/index", params, this.authorization)
      .subscribe(
        (res) => {
          this.resSerNotification = res;

          this.globalAppService.resolveResponse(this.resSerNotification, false).then((res) => {
            let responseResolveResponseDown = res;
            if (responseResolveResponseDown == true) {
              if (this.resSerNotification.data) {
                // Asigna las notificaciones
                this.dataNotification = this.resSerNotification.data;
                // Asigna la cantidad de notificaciones
                this.countNotification = this.resSerNotification.data.length;
              }
            }
          });
        },
        (err) => {
          this.resSerNotificationErr = err;
          // Evaluar respuesta de error del servicio
          this.globalAppService.resolveResponseError(this.resSerNotificationErr).then((res) => {});
        }
      );
  }

  chageStatusNotification(data) {
    this.loadIdsChangeStatus([data]).then((res) => {
      let dataNew = res;
      this.restService
        .restPut(environment.versionApiDefault + "notificacion/change-status", dataNew, this.authorization)
        .subscribe(
          (res) => {
            this.resSerChangeStatusNotifi = res;

            if (this.resSerChangeStatusNotifi.status) {
              this.resSerChangeStatusNotifi.data.forEach((dataSer) => {
                this.eliminarRegistro(dataSer.id);
              });
            }
          },
          (err) => {
            // Evaluar respuesta de error del servicio
            this.resSerChangeStatusNotifiErr = err;
            this.globalAppService.resolveResponseError(this.resSerChangeStatusNotifiErr, false).then((res) => {});
          }
        );
    });
  }

  loadIdsChangeStatus(dataRow) {
    return new Promise<any>((resolve) => {
      this.idsChangeStatus = [];
      dataRow.forEach((data) => {
        this.idsChangeStatus.push(data.id + "|" + data.idInitialList);
      });
      resolve(this.idsChangeStatus);
    });
  }

  /**
   * Solo debe llegar el Id del initial list idInitialList para eliminar la notificacion
   * @param data id
   */
  eliminarRegistro(data) {
    /** Recorrido de la data del initial list en notificaciones */
    this.dataNotification.forEach((infoIni, index) => {
      if (infoIni.id == data) {
        this.dataNotification.splice(index, 1);
        // Asigna la cantidad de notificaciones
        this.countNotification = this.dataNotification.length;
      }
    });
  }

  /** Setear ruta de actualizacion de cuenta del usuario logueado */
  setRutaMiCuenta(userID) {
    this.rutaMiCuenta = this.rutaMiCuenta + this.userID;
  }

  changeLanguage(data) {
    this.activateTranslateService.activateTranslate(data);
    // Toma el hash del usuario para crear el room en el servidor
    /**
     * Emit a cada usuario reportando el lenguaje
     */
    this.socketioService.socketEmit(environment.socketLanguage, { room: this.userIDFull, language: data });
  }
}
