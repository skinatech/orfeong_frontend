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
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HttpClient } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";

/**
 * Importación de servio socket
 */
import { SocketioService } from "./services/socketio.service";

/**
 * Importación de servicios
 */
import { AuthService } from "./services/auth.service";
import { SweetAlertService } from "./services/sweet-alert.service";
import { ValidateTokenGuard } from "./guards/validate-token.guard";
import { FloatingButtonService } from "./services/floating-button.service";
import { ChangeChildrenService } from "./services/change-children.service";

/**
 * Importación de módulos
 */
import { UnlockModule } from "./modules/unlock/unlock.module";
import { LoginModule } from "./modules/login/login.module";
import { QrviewModule } from "./modules/qrview/qrview.module";
import { RegisterModule } from "./modules/register/register.module";
import { ResetPassModule } from "./modules/reset-pass/reset-pass.module";
import { ResetTokenPassModule } from "./modules/reset-token-pass/reset-token-pass.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { UsersModule } from "./modules/users/users.module";
import { SettingsAppModule } from "./modules/settings-app/settings-app.module";
import { FilingModule } from "./modules/filing/filing.module";
import { DocumentManagementModule } from "./modules/document-management/document-management.module";
import { CorrespondenceManagementModule } from "./modules/correspondence-management/correspondence-management.module";
import { ArchiveManagementModule } from "./modules/archive-management/archive-management.module";
import { DocumentaryLoansModule } from "./modules/documentary-loans/documentary-loans.module";
import { ReportsModule } from "./modules/reports/reports.module";
import { QueryViewFinderModule } from "./modules/query/query-view-finder.module";
import { AuditModule } from "./modules/audit/audit.module";
import { HelpModule } from "./modules/help/help.module";
import { AboutModule } from "./modules/about/about.module";

import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { FormlyModule } from "@ngx-formly/core";
import { DynamicFormsTypesRepeatComponent } from "./modules/components/dynamic-forms-types-repeat/dynamic-forms-types-repeat.component";
import { DynamicFormsTypesNotRepeatComponent } from "./modules/components/dynamic-forms-types-not-repeat/dynamic-forms-types-not-repeat.component";

import { BnNgIdleService } from "bn-ng-idle"; // import bn-ng-idle service
import { environment } from "src/environments/environment";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, environment.frontUrl + "assets/i18n/", ".json");
}

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,

    /**
     * Módulos
     */
    UnlockModule,
    LoginModule,
    QrviewModule,
    RegisterModule,
    ResetPassModule,
    ResetTokenPassModule,
    DashboardModule,
    UsersModule,
    SettingsAppModule,
    FilingModule,
    DocumentManagementModule,
    CorrespondenceManagementModule,
    ArchiveManagementModule,
    DocumentaryLoansModule,
    ReportsModule,
    QueryViewFinderModule,
    AuditModule,
    HelpModule,
    AboutModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        /* useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http);
        }, */

        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),

    FormlyModule.forRoot({
      types: [
        { name: "repeat", component: DynamicFormsTypesRepeatComponent },
        { name: "notrepeat", component: DynamicFormsTypesNotRepeatComponent },
      ],
    }),
  ],
  providers: [
    ValidateTokenGuard,
    AuthService,
    SweetAlertService,
    FloatingButtonService,
    SocketioService,
    ChangeChildrenService,
    BnNgIdleService,
  ],
  declarations: [AppComponent, DynamicFormsTypesRepeatComponent, DynamicFormsTypesNotRepeatComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
