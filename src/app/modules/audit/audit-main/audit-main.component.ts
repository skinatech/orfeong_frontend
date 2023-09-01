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

import { Component, OnInit, ViewChild, HostListener, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { NavItem } from "../../md/md.module";
import { Location } from "@angular/common";
import { AdminTopNavBarComponent } from "../../admin-layout/admin-top-nav-bar/admin-top-nav-bar.component";
import PerfectScrollbar from "perfect-scrollbar";
import { TranslateService } from "@ngx-translate/core";
import { ActivateTranslateService } from "../../../services/activate-translate.service";
import { environment } from "src/environments/environment";
import { RestService } from "src/app/services/rest.service";
import { BnNgIdleService } from "bn-ng-idle";
import { Subscription } from "rxjs/internal/Subscription";

@Component({
  selector: "app-audit-main",
  templateUrl: "./audit-main.component.html",
  styleUrls: ["./audit-main.component.css"],
})
export class AuditMainComponent implements OnInit, OnDestroy {
  /** Variables para el componente top-nav-bar */
  topNavBarTitle: string = "Auditoría"; // i18n
  topNavBarRouteActive: string = "";
  topNavBarOn: string = "";
  /** Fin Variables para el componente top-nav-bar */

  /** Variables para el componente sub-menú */
  subMenuStatus: boolean = true;
  subMenuTitle: string;
  subMenuActive: string = "audit";
  subMenuNotificationStatus: boolean = true;
  subMenuNotificationClassAlert: string = "alert alert-info alert-with-icon";
  subMenuNotificationMessage: string = "Seleccione el módulo que desea consultar."; // i18n
  /** Fin Variables para el componente sub-menú */

  public navItems: NavItem[];
  url: string;
  location: Location;

  /** Variables de internacionalización */
  activeLang: string;
  languageReceive: any;

  /** Variables para control de inactividad */
  userTimeOutSessionMin: any;
  subscriptionBnIdle$: Subscription;
  subscriptionTranslateService$: Subscription;

  @ViewChild("sidebar", { static: false }) sidebar: any;
  @ViewChild(AdminTopNavBarComponent, { static: false }) navbar: AdminTopNavBarComponent;

  constructor(
    private router: Router,
    location: Location,
    private translate: TranslateService,
    private activateTranslateService: ActivateTranslateService,
    public restService: RestService,
    private bnIdle: BnNgIdleService
  ) {
    this.location = location;
    /**
     * Idioma inical
     */
    this.detectLanguageInitial();
  }

  ngOnInit() {
    /**
     * Detectando si se ejecuta cambio de idioma
     */
    this.detectLanguageChange();
    this.calculateSessionInactivity("");
  }

  ngAfterViewInit() {
    this.runOnRouteChange();
  }

  public isMap() {
    if (this.location.prepareExternalUrl(this.location.path()) === "/maps/fullscreen") {
      return true;
    } else {
      return false;
    }
  }

  runOnRouteChange(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemSidebar = <HTMLElement>document.querySelector(".sidebar .sidebar-wrapper");
      const elemMainPanel = <HTMLElement>document.querySelector(".main-panel");
      let ps = new PerfectScrollbar(elemMainPanel);
      ps = new PerfectScrollbar(elemSidebar);
      ps.update();
    }
  }

  isMac(): boolean {
    let bool = false;
    if (navigator.platform.toUpperCase().indexOf("MAC") >= 0 || navigator.platform.toUpperCase().indexOf("IPAD") >= 0) {
      bool = true;
    }
    return bool;
  }

  /** Métodos agregados */
  onActivate() {
    this.subMenuStatus = false;
  }

  /** Métodos para el uso de la internacionalización */
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
  /** Fin Métodos para el uso de la internacionalización */

  /**
   * Metodo para inicializar la funcionalidad de inactividad
   * @params autho authorization
   */
  calculateSessionInactivity(autho) {
    let minutes = environment.timeOutSessionMin;

    this.callLocalStorageHashTimeOut().then((res) => {
      this.userTimeOutSessionMin = res;
      if (this.userTimeOutSessionMin) {
        minutes = this.userTimeOutSessionMin;
      }
      let seconds = minutes * 60;

      this.subscriptionBnIdle$ = this.bnIdle.startWatching(seconds).subscribe((res) => {
        if (res) {
          // Busca si hay un modal en el cuerpo
          const body = document.getElementsByTagName("body")[0];
          const modalBackdrop = document.getElementsByClassName("mat-dialog-container")[0];
          // Valida ai hay un modal
          if (modalBackdrop) {
            // Elimina el modal
            body.classList.remove("mat-dialog-container");
            modalBackdrop.remove();
          }
          this.restService.logout(autho, "inactividad");
        }
      });
    });
  }

  /**
   * Inicio Decoradores utilizados para conocer si se utiliza el mouse o el teclado
   * Se debe cambiar la metodología en caso de que el sistema se ponga lento o aparezcan muchos logs de advertencias como el siguiente:
   * [Violation] 'requestIdleCallback' handler took 62ms
   */
  @HostListener('click', ['$event.target'])onClick(btn) {
    if (!!this.subscriptionBnIdle$) {
      this.bnIdle.resetTimer();
    }
    
  }

  @HostListener('window:keydown', ['$event']) handleKeyDown(event: KeyboardEvent) {
    if (!!this.subscriptionBnIdle$) {
      this.bnIdle.resetTimer();
    }
  }
  /** Fin Decoradores utilizados para conocer si se utiliza el mouse o el teclado */

  /** Función que obtiene el tiempo de sessión para inactividad en el local storage */
  callLocalStorageHashTimeOut() {
    return new Promise((resolve) => {
      let timeOutLS = localStorage.getItem(environment.hashTimeOut);
      resolve(timeOutLS);
    });
  }

  ngOnDestroy() {
    if (!!this.subscriptionBnIdle$) this.subscriptionBnIdle$.unsubscribe();
    if (!!this.subscriptionTranslateService$) this.subscriptionTranslateService$.unsubscribe();
  }
}
