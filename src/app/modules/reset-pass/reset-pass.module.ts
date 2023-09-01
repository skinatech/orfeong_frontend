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
//import { MaterialModule } from '../../app.material.module';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { environment } from "src/environments/environment";

// Librería recaptcha de google
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from "ng-recaptcha";

/**
 * Importación de componentes
 */
import { ResetPassMainComponent } from "./reset-pass-main/reset-pass-main.component";

/**
 * Importación de módulos
 */
import { AuthLayoutModule } from "../auth-layout/auth-layout.module";
import { ComponentsModule } from "../components/components.module";

@NgModule({
  declarations: [ResetPassMainComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
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

    //MaterialModule,
    /**
     * Modulos
     */
    AuthLayoutModule,
    RecaptchaModule,
  ],
})
export class ResetPassModule {}
