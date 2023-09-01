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

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { environment } from "src/environments/environment";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient, HttpClientModule } from "@angular/common/http";

import { LoginRoutingModule } from "./login-routing.module";
import { MatInputModule } from "@angular/material/input";

/**
 * Importación de componentes
 */
import { LoginMainComponent } from "./login-main/login-main.component";

/**
 * Importación de módulos
 */
import { AuthLayoutModule } from "../auth-layout/auth-layout.module";
import { ComponentsModule } from "../components/components.module";
// Librería recaptcha de google
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from "ng-recaptcha";
import { LoginLicensingMessageComponent } from "./login-licensing-message/login-licensing-message.component";

@NgModule({
  declarations: [LoginMainComponent, LoginLicensingMessageComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http);
        },
        deps: [HttpClient],
      },
    }),
    /**
     * Modulos
     */
    AuthLayoutModule,
    ComponentsModule,
    RecaptchaModule,
  ],
  exports: [LoginMainComponent, LoginLicensingMessageComponent],
})
export class LoginModule {}
