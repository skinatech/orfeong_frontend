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

import { Component, OnInit, ElementRef, OnDestroy, ViewChild, TemplateRef } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { LoginLicensingMessageComponent } from "../login-licensing-message/login-licensing-message.component";
import { trigger, style, transition, animate, state } from "@angular/animations";
/**
  Import servicio para la conexión con los sockets
 */
import { SocketioService } from "src/app/services/socketio.service";
import { MatDialog } from "@angular/material/dialog";
import { environment } from "src/environments/environment";

/**
 * Importación de servicios
 */
import { SweetAlertService } from "src/app/services/sweet-alert.service";
import { GlobalAppService } from "src/app/services/global-app.service";
import { ActivateTranslateService } from "src/app/services/activate-translate.service";
import { AuthService } from "src/app/services/auth.service";
import { ChangeChildrenService } from "../../../services/change-children.service";

/**
 * Importación de interfaces
 */
import { IConfigInicial, IConfigParams } from "../../../interfaces/configuracion-inicial.interface";
import { Subscription } from "rxjs/internal/Subscription";

declare var $: any;

@Component({
  selector: "app-login-main",
  templateUrl: "./login-main.component.html",
  styleUrls: ["./login-main.component.css"],
  animations: [
    trigger("enterState", [
      state(
        "void",
        style({
          transform: "translateY(-100%)",
          opacity: 0,
        })
      ),
      transition(":enter", [
        animate(
          500,
          style({
            transform: "translateY(0)",
            opacity: 1,
          })
        ),
      ]),
    ]),
  ],
})
export class LoginMainComponent implements OnInit, OnDestroy {
  private toggleButton: any;
  private sidebarVisible: boolean;
  private nativeElement: Node;
  hashLocalStorage: any;

  /**
   * Configuración del formulario para el login
   */
  loginForm: UntypedFormGroup;
  validEmailType: boolean = false;
  loginFormSubmitStatus: boolean = false; // Variable utilizada para saber si está siendo procesado (true)
  /**
   * Configuraciones para los servicios
   */
  responseLogin: any;
  responseLoginErr: any;

  activeLang: string;
  languageReceive: any;

  // Autentificacion
  authorization: string;
  dataUser: any;

  subscriptionTranslateService$: Subscription;
  subscriptionChildrenService$: Subscription;

  dialogRef: any;

  activeRecaptcha = false;
  captchaSiteKey: string;

  @ViewChild("captchaRef", { static: false }) captchaRef: TemplateRef<any>;

  constructor(
    private element: ElementRef,
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    public sweetAlertService: SweetAlertService,
    private router: Router,
    public globalAppService: GlobalAppService,
    private translate: TranslateService,
    private activateTranslateService: ActivateTranslateService,
    private socketioService: SocketioService,
    private dialog: MatDialog,
    private changeChildrenService: ChangeChildrenService
  ) {
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;

    /**
     * Idioma inical
     */
    this.detectLanguageInitial();
  }

  ngOnInit() {
    let navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName("navbar-toggle")[0];
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("login-page");
    body.classList.add("off-canvas-sidebar");

    /**
     * Configuración del formulario para el login
     */
    this.loginForm = this.formBuilder.group({
      username: new UntypedFormControl(
        "",
        Validators.compose([
          // Validators.email,
          Validators.required,
        ])
      ),
      password: new UntypedFormControl("", Validators.compose([Validators.required])),
      recaptcha: "",
    });

    /**
     * Validando si el token existe para y es valido para enviar al dashboard o mostar formulario para ingresar
     */
    this.validateTokenAccess();

    /**
     * Detectando si se ejecuta cambio de idioma
     */
    this.detectLanguageChange();

    this.detectedCloseModalLicensingMessage();

    /**
     * Configuración general del sistema en este caso se valida
     * si debemos cargar el captcha, si es así se llaman los datos
     * para el funcionamiento del mismo
     */
    this.configInitial();
  }

  /**
   * Configuración inicial del sistema
   * @returns void
   */
  configInitial(): void {
    const data = {
      csInicial: "captcha",
    };
    this.authService
      .authPost(`${environment.versionApiDefault}site/cs-inicial`, data, false)
      .subscribe((responseApi: IConfigInicial) => {
        this.globalAppService.resolveResponse(responseApi).then((responseGlobal) => {
          if (responseGlobal == true) {
            if (responseApi.dataStatus && Number(responseApi.valorCsInicial) === environment.statusTodoNumber.activo) {
              this.configParams();
            }
          }
        });
      });
  }

  /**
   * Configuración de params
   * @returns void
   */
  configParams(): void {
    const data = {
      csParam: "captchaSiteKey",
    };
    this.authService
      .authPost(`${environment.versionApiDefault}site/cs-params`, data, false)
      .subscribe((responseApi: IConfigParams) => {
        this.globalAppService.resolveResponse(responseApi).then((responseGlobal) => {
          if (responseGlobal == true) {
            const dataCaptchaSiteKey = responseApi.data.find((item) => item.llaveCsParams === data.csParam);
            if (dataCaptchaSiteKey) {
              this.activeRecaptcha = true;
              this.captchaSiteKey = dataCaptchaSiteKey.valorCsParams;
            }
          }
        });
      });

  }

  detectedCloseModalLicensingMessage() {
    this.subscriptionChildrenService$ = this.changeChildrenService.closeComponent.subscribe(
      (response: { proccess: string; continue: boolean }) => {
        if (response.continue) {
          this.login();
        }
        this.dialogRef.close(response.continue);
      }
    );
  }

  openModalLicensingMessage(file, width, data) {
    this.dialogRef = this.dialog.open(file, {
      disableClose: false,
      width: width,
      data: data,
    });
    this.dialogRef.afterClosed().subscribe((response) => {
      if (!response) {
        location.reload();
      }
    });
  }

  validateTokenAccess() {
    this.hashLocalStorage = localStorage.getItem(environment.hashSkina);
    if (this.hashLocalStorage) {
      this.authService.validateToken(this.hashLocalStorage).subscribe(
        (data) => {
          this.router.navigate(["/dashboard"]);
        },
        (err) => {
          this.logout();
        }
      );
    } else {
    }
  }

  sidebarToggle() {
    let toggleButton = this.toggleButton;
    let body = document.getElementsByTagName("body")[0];
    let sidebar = document.getElementsByClassName("navbar-collapse")[0];
    if (this.sidebarVisible == false) {
      setTimeout(function () {
        toggleButton.classList.add("toggled");
      }, 500);
      body.classList.add("nav-open");
      this.sidebarVisible = true;
    } else {
      this.toggleButton.classList.remove("toggled");
      this.sidebarVisible = false;
      body.classList.remove("nav-open");
    }
  }

  aceptaLicencia() {
    this.validateShowPanelLicensing().then((response) => {
      if (response === 1) {
        this.login();
      } else {
        this.openModalLicensingMessage(LoginLicensingMessageComponent, "75%", true);
      }
    });
  }

  login() {
    this.sweetAlertService.sweetLoading();
    this.loginForm.controls["recaptcha"].setValue(null); // Limpiando el valor del campo captcha utilizado

    this.authService.authPost("version1/site/login", this.loginForm.value, false).subscribe(
      (data) => {
        this.responseLogin = data;

        this.globalAppService.resolveResponse(this.responseLogin).then((res) => {
          let responseResolverRespuesta = res;

          if (responseResolverRespuesta == true) {
            // Construccion de solo data para login
            let dataUser = {
              data: this.responseLogin.data,
            };
            localStorage.setItem(environment.hashSkina, this.authService.encryptAES(dataUser, false));
            localStorage.setItem(environment.hashMenu, this.authService.encryptAES(this.responseLogin.dataMenu, false));
            localStorage.setItem(environment.hashTimeOut, this.responseLogin.data.tiempoInactividadCgGeneral);

            this.analyzeLocalStorage();

            /**
             * Indicando al servidor de sockets que hay un usuario conectado, este proceso asigna el id del usuario como id de comunicación en el server de sockets
             */
            this.socketioService.socketConnect({ idUser: this.responseLogin.data.idDataCliente });
            /**
             * Fin conexión sockets
             */
            this.sweetAlertService.sweetClose();
            this.router.navigate(["/dashboard"]);
            this.loginFormSubmitStatus = false;
          } else {
            /** Validar si existe solicitud de cambio de contraseña */
            if (this.responseLogin.status == environment.statusErrorValidacion) {
              if (this.responseLogin.statusChangePassword === true) {
                this.router.navigate(["/resetpass"]);
              }
            }
          }
        });
      },
      (err) => {
        this.responseLoginErr = err;
        let errorService = {
          error: ["Error de conexión"],
        };
        this.sweetAlertService.sweetInfo("Algo está mal", errorService);
      }
    );
  }

  /** Funcion para analizar y validar el local storage */
  analyzeLocalStorage() {
    /** Validar si existia un usuario logueado anteriormente en el navegador mediante radicacion mail */
    let hashMailSkina = localStorage.getItem(environment.hashMailSkina);
    let hashMailSkinaDecipted = this.authService.decryptAES(hashMailSkina);
    if (hashMailSkinaDecipted != null) {
      /** Comparar el usuario actual con el usuario que realizo el proceso de radicacion email en la sesion anterior */
      if (hashMailSkinaDecipted["userLoginApp"] != this.loginForm.controls["username"].value) {
        localStorage.removeItem(environment.hashMailSkina);
        localStorage.removeItem(environment.hashMailInitialListSkina);
      }
    } else {
      localStorage.removeItem(environment.hashMailSkina);
      localStorage.removeItem(environment.hashMailInitialListSkina);
    }
    /** Fin Validar si existia un usuario logueado anteriormente en el navegador mediante radicacion mail */
  }

  logout() {
    localStorage.clear();
  }

    /** Validar si el captcha ya fué ejecutado */
    validateRecaptcha(e) {
      if (e) {
        this.loginFormSubmitStatus = true;
        e.grecaptcha.reset();
        e.grecaptcha.execute();
      } else {
        this.validateShowPanelLicensing().then((response) => {
          if (response === 1) {
            this.login();
          } else {
            this.openModalLicensingMessage(LoginLicensingMessageComponent, "75%", true);
          }
        });
        this.loginFormSubmitStatus = false;
      }
    }  

  validateShowPanelLicensing() {
    return new Promise((resolve) => {
      this.authService
        .authPost("version1/site/user-status-licensing", this.loginForm.value, false)
        .subscribe((responseApi) => {
          this.globalAppService.resolveResponse(responseApi).then((responseGlobal) => {
            if (responseGlobal == true) {
              resolve(responseApi.data);
            }
          });
        });
    });
  }

  /** Obtener la respuesta del captcha */
  responseCaptcha(e) {
    let responseCaptcha = e;
    this.loginForm.controls["recaptcha"].setValue(responseCaptcha); // Asignar el valor de la respuesta al recaptcha

    // Consultar si la función fue llamada desde el submit del formulario o la validación automatica del recaptcha
    if (this.loginFormSubmitStatus == true) {
      if (responseCaptcha != null && responseCaptcha != "") {
        this.validateShowPanelLicensing().then((response) => {
          if (response === 1) {
            this.login();
          } else {
            this.openModalLicensingMessage(LoginLicensingMessageComponent, "75%", true);
          }
        });
        this.loginFormSubmitStatus = false;
      } else {
        this.sweetAlertService.sweetClose();
        let errorCaptcha = {
          error: ["Ha fallado la validación el captcha"],
        };
        this.sweetAlertService.sweetInfo("Algo está mal", errorCaptcha);
        this.loginFormSubmitStatus = false;
      }
    } else {
      this.sweetAlertService.sweetClose();
    }
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

  ngOnDestroy() {
    const body = document.getElementsByTagName("body")[0];
    body.classList.remove("login-page");
    body.classList.remove("off-canvas-sidebar");

    if (!!this.subscriptionTranslateService$) this.subscriptionTranslateService$.unsubscribe();
    if (!!this.subscriptionChildrenService$) this.subscriptionChildrenService$.unsubscribe();
    this.socketioService.socketDisconnect();
  }
}
