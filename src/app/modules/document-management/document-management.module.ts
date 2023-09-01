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
import { DocumentManagementRoutingModule } from "./document-management-routing.module";
import { AdminLayoutModule } from "../admin-layout/admin-layout.module";
import { ComponentsModule } from "../components/components.module";
import { DocManagMainComponent } from "./doc-manag-main/doc-manag-main.component";
/**
 * Dependencias
 */
import { DocManagDependenciesIndexComponent } from "./doc-manag-dependencies-index/doc-manag-dependencies-index.component";
import { DocManagDependenciesFormComponent } from "./doc-manag-dependencies-form/doc-manag-dependencies-form.component";
import { DocManagDependenciesCreateComponent } from "./doc-manag-dependencies-create/doc-manag-dependencies-create.component";
import { DocManagDependenciesUpdateComponent } from "./doc-manag-dependencies-update/doc-manag-dependencies-update.component";
import { DocManagDependenciesViewComponent } from "./doc-manag-dependencies-view/doc-manag-dependencies-view.component";
import { DocManagUploadTrdComponent } from "./doc-manag-upload-trd/doc-manag-upload-trd.component";
import { DocManagDependenciesVersionViewComponent } from "./doc-manag-dependencies-version-view/doc-manag-dependencies-version-view.component";
import { DocManagDependenciesVersionEditComponent } from "./doc-manag-dependencies-version-edit/doc-manag-dependencies-version-edit.component";
import { DocManagVersionTrdIndexComponent } from "./doc-manag-version-trd-index/doc-manag-version-trd-index.component";
import { DocManagVersionTrdViewComponent } from "./doc-manag-version-trd-view/doc-manag-version-trd-view.component";
// Expedientes
import { DocManagFolderIndexComponent } from "./doc-manag-folder-index/doc-manag-folder-index.component";
import { DocManagFolderFormComponent } from "./doc-manag-folder-form/doc-manag-folder-form.component";
import { DocManagFolderCreateComponent } from "./doc-manag-folder-create/doc-manag-folder-create.component";
import { DocManagFolderUpdateComponent } from "./doc-manag-folder-update/doc-manag-folder-update.component";
import { DocManagFolderViewComponent } from "./doc-manag-folder-view/doc-manag-folder-view.component";
import { DocManagFolderIndIndexComponent } from "./doc-manag-folder-ind-index/doc-manag-folder-ind-index.component";
import {
  DocManagCrossReferenceModalComponent,
  DocManagCrossReferenceModalDialog,
} from "./doc-manag-cross-reference/doc-manag-cross-reference-modal.component";

@NgModule({
    declarations: [
        DocManagMainComponent,
        DocManagDependenciesIndexComponent,
        DocManagDependenciesFormComponent,
        DocManagDependenciesCreateComponent,
        DocManagDependenciesUpdateComponent,
        DocManagDependenciesViewComponent,
        DocManagUploadTrdComponent,
        DocManagDependenciesVersionViewComponent,
        DocManagDependenciesVersionEditComponent,
        DocManagVersionTrdIndexComponent,
        DocManagVersionTrdViewComponent,
        DocManagFolderIndexComponent,
        DocManagFolderFormComponent,
        DocManagFolderCreateComponent,
        DocManagFolderUpdateComponent,
        DocManagFolderViewComponent,
        DocManagFolderIndIndexComponent,
        DocManagCrossReferenceModalComponent,
        DocManagCrossReferenceModalDialog,
    ],
    imports: [
        CommonModule,
        DocumentManagementRoutingModule,
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
    exports: [],
    providers: [BnNgIdleService]
})
export class DocumentManagementModule {}
