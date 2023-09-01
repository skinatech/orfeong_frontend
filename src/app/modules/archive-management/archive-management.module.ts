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
import { ArchiveManagementRoutingModule } from "./archive-management-routing.module";
import { AdminLayoutModule } from "../admin-layout/admin-layout.module";
import { ComponentsModule } from "../components/components.module";
// Physical Space
import { ArchiveManagementMainComponent } from "./archive-management-main/archive-management-main.component";
import { ArcManagPhysicalSpaceIndexComponent } from "./arc-manag-physical-space-index/arc-manag-physical-space-index.component";
import { ArcManagPhysicalSpaceFormComponent } from "./arc-manag-physical-space-form/arc-manag-physical-space-form.component";
import { ArcManagPhysicalSpaceCreateComponent } from "./arc-manag-physical-space-create/arc-manag-physical-space-create.component";
import { ArcManagPhysicalSpaceUpdateComponent } from "./arc-manag-physical-space-update/arc-manag-physical-space-update.component";
import { ArcManagPhysicalSpaceViewComponent } from "./arc-manag-physical-space-view/arc-manag-physical-space-view.component";
// Archive filing
import { ArcManagArchiveFilingIndexComponent } from "./arc-manag-archive-filing-index/arc-manag-archive-filing-index.component";
import {
  ArcManagModalArchiveComponent,
  ArchiveDialog,
} from "./arc-manag-modal-archive/arc-manag-modal-archive.component";
import { ArcManagArchiveLocationComponent } from "./arc-manag-archive-location/arc-manag-archive-location.component";
import { ArcManagDocuTransferIndexComponent } from "./arc-manag-docu-transfer-index/arc-manag-docu-transfer-index.component";

@NgModule({
    declarations: [
        ArchiveManagementMainComponent,
        ArcManagPhysicalSpaceIndexComponent,
        ArcManagPhysicalSpaceFormComponent,
        ArcManagPhysicalSpaceCreateComponent,
        ArcManagPhysicalSpaceUpdateComponent,
        ArcManagPhysicalSpaceViewComponent,
        ArcManagArchiveFilingIndexComponent,
        ArcManagModalArchiveComponent,
        ArchiveDialog,
        ArcManagArchiveLocationComponent,
        ArcManagDocuTransferIndexComponent,
    ],
    imports: [
        CommonModule,
        ArchiveManagementRoutingModule,
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
    providers: [BnNgIdleService]
})
export class ArchiveManagementModule {}
