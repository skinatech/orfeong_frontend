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
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { MaterialModule } from "../../app.material.module";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { BnNgIdleService } from 'bn-ng-idle';
/**
 * Importación de modulos
 */
import { FilingRoutingModule } from "./filing-routing.module";
import { AdminLayoutModule } from "../admin-layout/admin-layout.module";
import { ComponentsModule } from "../components/components.module";
/**
 * Radicación
 */
import { FilingMainComponent } from "./filing-main/filing-main.component";
import { FilingIndexComponent } from "./filing-index/filing-index.component";
import { FilingFormComponent } from "./filing-form/filing-form.component";
import { FilingCreateComponent } from "./filing-create/filing-create.component";
import { FilingUpdateComponent } from "./filing-update/filing-update.component";
import { FilingViewComponent } from "./filing-view/filing-view.component";
import { FilingEmailFormComponent } from "./filing-email-form/filing-email-form.component";
import { FilingEmailLoginComponent } from "./filing-email-login/filing-email-login.component";
import { FilingEmailIndexComponent } from "./filing-email-index/filing-email-index.component";
import {
  FilingEmailViewContentComponent,
  FilingEmailViewContentDialog,
} from "./filing-email-view-content/filing-email-view-content.component";
import { SanitizeHtmlPipe } from "../../pipes/sanitize-html.pipe";
import { FilingCreateDetailResolutionComponent } from "./filing-create-detail-resolution/filing-create-detail-resolution.component";

@NgModule({
    declarations: [
        FilingMainComponent,
        FilingIndexComponent,
        FilingFormComponent,
        FilingCreateComponent,
        FilingUpdateComponent,
        FilingViewComponent,
        FilingEmailFormComponent,
        FilingEmailLoginComponent,
        FilingEmailIndexComponent,
        FilingEmailViewContentComponent,
        FilingEmailViewContentDialog,
        SanitizeHtmlPipe,
        FilingCreateDetailResolutionComponent,
    ],
    imports: [
        CommonModule,
        FilingRoutingModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
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
        AdminLayoutModule,
        ComponentsModule,
        MatSelectModule,
        MatFormFieldModule,
        NgxMatSelectSearchModule,
    ],
    exports: [FilingCreateDetailResolutionComponent],
    providers: [BnNgIdleService]
})
export class FilingModule {}
