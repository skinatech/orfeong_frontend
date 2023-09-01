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
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "../../../../environments/environment";

import swal from "sweetalert2";
import { SweetAlertService } from "src/app/services/sweet-alert.service";
import { GlobalAppService } from "src/app/services/global-app.service";
import { ActivateTranslateService } from "../../../services/activate-translate.service";
import { Subscription } from 'rxjs/internal/Subscription';
import { trigger, style, transition, animate, state } from "@angular/animations";

/**
 * Importación de interfaces
 */
import { IConfigInicial, IConfigParams } from "../../../interfaces/configuracion-inicial.interface";

@Component({
  selector: "app-reset-pass-main",
  templateUrl: "./reset-pass-main.component.html",
  styleUrls: ["./reset-pass-main.component.css"],
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
export class ResetPassMainComponent implements OnInit, OnDestroy {
  private toggleButton: any;
  private sidebarVisible: boolean;
  private nativeElement: Node;

  //Formulario
  resetPassForm: UntypedFormGroup;
  isSubmitted: boolean = false;

  titleCard: any = "¿Olvidó su contraseña?";
  textCard: any = "A continuación introduzca el correo con el que inicia sesión";

  //Respuesta de servicio
  responseServiceResetPass: any;
  responseServiceResetPassErr: any;

  //botones
  styleButtonForm: any = "btn-info btn-info-bdo";
  textButtonForm: any = "Recuperar contraseña";

  //Mensajes succes
  titleSuccessPass = "Correcto";
  messageSuccessPass = "Se realizó la solicitud de forma correcta";

  //Mensajes de error
  resErrsJsonStatus: boolean = false;
  resErrsJsonList: any;
  resErrsJson: any;
  messageErrorFront: any = ["Por favor verifique los datos ingresados"];
  messageErrorPost: any = ["No se pudo procesar el formulario"];

  activeLang: string;
  languageReceive: any;

  subscriptionTranslateService$: Subscription;

  activeRecaptcha = false;
  captchaSiteKey: string;

  @ViewChild("captchaRefR", { static: false }) captchaRefR: TemplateRef<any>;

  constructor(
    private element: ElementRef,
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private router: Router,
    public sweetAlertService: SweetAlertService,
    public globalAppService: GlobalAppService,
    private translate: TranslateService,
    private activateTranslateService: ActivateTranslateService
  ) {
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;

    this.resetPassForm = this.formBuilder.group({
      email: new UntypedFormControl("", Validators.compose([Validators.email, Validators.required])),
      username: new UntypedFormControl("", Validators.compose([Validators.required])),
      recaptcha: "",
    });

    /**
     * Idioma inical
     */
    this.detectLanguageInitial();
  }

  ngOnInit() {
    var navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName("navbar-toggle")[0];
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("login-page");
    body.classList.add("off-canvas-sidebar");
    // const card = document.getElementsByClassName("card")[0];
    // setTimeout(function () {
    //   // after 1000 ms we add the class animated to the login/register card
    //   card.classList.remove("card-hidden");
    // }, 700);

    /**
     * Detectando si se ejecuta cambio de idioma
     */
    this.detectLanguageChange();

    /**
     * Configuración general del sistema en este caso se valida
     * si debemos cargar el captcha, si es así se llaman los datos
     * para el funcionamiento del mismo
     */
    this.configInicial();
  }

  /**
   * Configuración inicial del sistema
   * @returns void
   */
  configInicial(): void {
    const data = {
      csInicial: "captcha",
    };
    this.authService.authPost("version1/site/cs-inicial", data, false).subscribe((responseApi: IConfigInicial) => {
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
    this.authService.authPost("version1/site/cs-params", data, false).subscribe((responseApi: IConfigParams) => {
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

  submitForm() {
    this.isSubmitted = true;
    this.sweetAlertService.sweetLoading();
    if (!this.resetPassForm.valid) {
      this.resErrsJsonStatus = true;
      this.resErrsJson = this.messageErrorFront;
      this.isSubmitted = false;
      this.sweetAlertService.sweetClose();
    } else {
      this.authService
        .authPost(environment.versionApiDefault + "site/request-password-reset", this.resetPassForm.value)
        .subscribe(
          (res) => {
            this.responseServiceResetPass = res;
            if (this.responseServiceResetPass.status == environment.statusErrorValidacion) {
              this.responseServiceResetPassErr = res;
              this.resErrsJsonStatus = false;
              this.resErrsJsonList = this.responseServiceResetPassErr.data;
              // this.resErrsJson = [];
              // Object.keys(this.resErrsJsonList).forEach(keyName => {
              //   this.resErrsJsonList[keyName].forEach(errorKeyName => {
              //     this.resErrsJson.push(errorKeyName);
              //   });
              // });
              this.sweetAlertService.sweetInfo("Algo está mal", this.resErrsJsonList);
              this.isSubmitted = false;
              // this.sweetAlertService.sweetClose();
            } else {
              // this.showSwal('success-message', this.titleSuccessPass, this.responseServiceResetPass.message);
              this.sweetAlertService.showSwal(
                "success-message",
                this.titleSuccessPass,
                this.responseServiceResetPass.message
              );
              this.router.navigate(["/login"]);
            }
          },
          (err) => {
            this.responseServiceResetPassErr = err;
            this.resErrsJsonStatus = false;
            this.resErrsJson = this.messageErrorPost;
            this.isSubmitted = false;
            this.sweetAlertService.sweetInfo("Algo está mal", this.resErrsJson);
          }
        );
    }
  }

  showSwal(type, titleMessage, message) {
    if (type == "success-message") {
      swal({
        title: titleMessage,
        text: message,
        buttonsStyling: false,
        confirmButtonClass: "btn btn-success",
        type: "success",
      }).catch(swal.noop);
    }
  }

  sidebarToggle() {
    var toggleButton = this.toggleButton;
    var body = document.getElementsByTagName("body")[0];
    var sidebar = document.getElementsByClassName("navbar-collapse")[0];
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

  ngOnDestroy() {
    const body = document.getElementsByTagName("body")[0];
    body.classList.remove("login-page");
    body.classList.remove("off-canvas-sidebar");

    if (!!this.subscriptionTranslateService$) this.subscriptionTranslateService$.unsubscribe();
  }

  goToLogin() {
    this.router.navigate(["/login"]);
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

  /** Validar si el captcha ya fué ejecutado */
  validateRecaptcha(e) {
    this.isSubmitted = true;
    e.grecaptcha.reset();
    this.sweetAlertService.sweetLoading();
    e.grecaptcha.execute();
  }

  /** Obtener la respuesta del captcha */
  responseCaptcha(e) {
    let responseCaptcha = e;
    this.resetPassForm.controls["recaptcha"].setValue(responseCaptcha); // Asignar el valor de la respuesta al recaptcha

    // Consultar si la función fue llamada desde el submit del formulario o la validación automatica del recaptcha

    if (this.isSubmitted == true) {
      if (responseCaptcha != null && responseCaptcha != "") {
        this.submitForm();
        this.isSubmitted = false;
      } else {
        this.sweetAlertService.sweetClose();
        let errorCaptcha = {
          error: ["Ha fallado la validación el captcha"],
        };
        this.sweetAlertService.sweetInfo("Algo está mal", errorCaptcha);
        this.isSubmitted = false;
      }
    } else {
      this.sweetAlertService.sweetClose();
    }
  }
}
