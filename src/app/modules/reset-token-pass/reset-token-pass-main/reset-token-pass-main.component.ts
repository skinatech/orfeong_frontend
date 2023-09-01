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

import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { trigger, style, transition, animate, state } from "@angular/animations"; 

import swal from 'sweetalert2';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivateTranslateService } from 'src/app/services/activate-translate.service';

import { PasswordValidator } from "../../../custom-validators/password.validator";
import { GlobalAppService } from "../../../services/global-app.service";
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: "app-reset-token-pass-main",
  templateUrl: "./reset-token-pass-main.component.html",
  styleUrls: ["./reset-token-pass-main.component.css"],
})
export class ResetTokenPassMainComponent implements OnInit, OnDestroy {
  private toggleButton: any;
  private sidebarVisible: boolean;
  private nativeElement: Node;

  //Formulario
  resetTokenPassForm: UntypedFormGroup;
  isSubmitted: boolean = false;

  //Respuesta de servicio
  responseServiceTokenPass: any;
  responseServiceResetPass: any;
  paramToken: any;

  //botones
  styleButtonForm: any = "btn-info btn-info-bdo";
  textButtonForm: any = "Enviar";

  //Mensajes succes
  titleSuccessPass = "Correcto!";
  messageSuccessPass = "Se estableció la nueva contraseña de forma correcta";
  //Mensajes de error
  resErrsJsonStatus: boolean = false;
  resErrsJsonList: any;
  resErrsJson: any;
  titleErrorToken: string = "Token inválido!";
  messageErrorToken: string = "El token es inválido o se encuentra vencido, por favor solicítalo de nuevo";
  messageErrorFront: any = ["Por favor verifique los datos ingresados"];
  messageErrorPost: any = ["No se pudo procesar el formulario"];

  mensaMinCaracteres: boolean = false;
  contrasenaIgual: boolean = false;

  activeLang: string;
  languageReceive: any;

  subscriptionTranslateService$: Subscription;

  constructor(
    private element: ElementRef,
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public sweetAlertService: SweetAlertService,
    private translate: TranslateService,
    private activateTranslateService: ActivateTranslateService,
    public globalAppService: GlobalAppService
  ) {
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;

    this.resetTokenPassForm = this.formBuilder.group(
      {
        password: new UntypedFormControl(
          "",
          Validators.compose([
            Validators.minLength(6),
            Validators.required,
            PasswordValidator,
            //Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=.*[$@$!%*?&¿¡!~#]).{6,30}')
          ])
        ),
        passwordConfirma: new UntypedFormControl(
          "",
          Validators.compose([Validators.minLength(6), Validators.required])
        ),
        token: [this.paramToken, Validators.required],
      },
      { validator: this.checkIfMatchingPasswords("password", "passwordConfirma") }
    );

    this.detectLanguageInitial();
  }

  ngOnInit() {
    var navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName("navbar-toggle")[0];
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("login-page");
    body.classList.add("off-canvas-sidebar");
    const card = document.getElementsByClassName("card")[0];
    setTimeout(function () {
      // after 1000 ms we add the class animated to the login/register card
      card.classList.remove("card-hidden");
    }, 700);

    this.getTokenRequest();
    /**
     * Detectando si se ejecuta cambio de idioma
     */
    this.detectLanguageChange();
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

  /*** Función que consulta el token recibido por parametros get y activa la función de que ejecuta el servicio de validación ***/
  getTokenRequest() {
    this.route.params.subscribe((params) => {
      this.paramToken = params["params"];
      let paramSend = {
        token: this.paramToken,
      };
      this.onSearch(paramSend);
    });
  }

  /* la variable term trae la información del token temporal para la recuperación de contraseña */
  onSearch(term) {
    this.sweetAlertService.sweetLoading();

    this.authService.authPost(environment.versionApiDefault + "site/validate-token-password", term).subscribe(
      (res) => {
        this.responseServiceTokenPass = res;
        // this.resetTokenPassForm.controls['token'].setValue(this.responseServiceTokenPass.data);
        // return true;

        if (this.responseServiceTokenPass.status === 200) {
          this.resetTokenPassForm.controls["token"].setValue(this.responseServiceTokenPass.data);
          this.sweetAlertService.sweetClose();
          return true;
        } else if (this.responseServiceTokenPass.status == environment.statusErrorValidacion) {
          this.sweetAlertService.sweetInfo("Algo está mal", this.responseServiceTokenPass.data);
          this.router.navigate(["/login"]);

          this.isSubmitted = false;
        }
      },
      (err) => {
        let error = this.translate.instant(this.messageErrorToken);
        let errors = {
          error: [error],
        };
        this.sweetAlertService.sweetInfo(this.titleErrorToken, errors);
        this.router.navigate(["/login"]);
        return false;
      }
    );
  }

  submitForm() {
    this.isSubmitted = true;
    this.sweetAlertService.sweetLoading();
    if (!this.resetTokenPassForm.valid) {
      this.sweetAlertService.sweetInfo("Algo está mal", "");
    } else {
      this.authService
        .authPost(environment.versionApiDefault + "site/reset-password", this.resetTokenPassForm.value)
        .subscribe(
          (res) => {
            this.responseServiceResetPass = res;

            if (this.responseServiceResetPass.status === environment.statusErrorValidacion) {
              this.sweetAlertService.sweetInfo("Algo está mal", this.responseServiceResetPass.data);

              this.isSubmitted = false;
              this.sweetAlertService.sweetClose();
            } else {
              let message = this.translate.instant(this.messageSuccessPass);
              this.sweetAlertService.showSwal("success-message", this.titleSuccessPass, message);
              this.router.navigate(["/login"]);
            }
          },
          (err) => {
            this.responseServiceResetPass = err;
            this.globalAppService.resolveResponseError(this.responseServiceResetPass, false).then((res) => {});

            this.isSubmitted = false;
            this.sweetAlertService.sweetClose();
          }
        );
    }
  }

  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: UntypedFormGroup) => {
      let passwordInput = group.controls[passwordKey];
      let passwordConfirmationInput = group.controls[passwordConfirmationKey];
      let cant = passwordInput.value.length;
      if (cant > 0 && cant < 6) {
        this.mensaMinCaracteres = true;
      } else {
        this.mensaMinCaracteres = false;
      }
      if (passwordInput.value !== passwordConfirmationInput.value) {
        this.contrasenaIgual = true;
        return passwordConfirmationInput.setErrors({ notEquivalent: true });
      } else {
        this.contrasenaIgual = false;
        return passwordConfirmationInput.setErrors(null);
      }
    };
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
    } else if (type == "title-and-text") {
      swal({
        title: titleMessage,
        text: message,
        buttonsStyling: false,
        confirmButtonClass: "btn btn-info",
      }).catch(swal.noop);
    }
  }

  ngOnDestroy() {
    const body = document.getElementsByTagName("body")[0];
    body.classList.remove("register-page");
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
}
