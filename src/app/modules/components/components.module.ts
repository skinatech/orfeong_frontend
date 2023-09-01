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
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { EcoFabSpeedDialModule } from "@ecodev/fab-speed-dial";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../../app.material.module";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { FormlyModule } from "@ngx-formly/core";
import { FormlyMaterialModule } from "@ngx-formly/material";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { ComponentsRoutingModule } from "./components-routing.module";
import { LoadingAppComponent } from "./loading-app/loading-app.component";
import { LoadingAuthComponent } from "./loading-auth/loading-auth.component";
import { ErrorsFormsComponent } from "./errors-forms/errors-forms.component";
import { SubMenuComponent } from "./sub-menu/sub-menu.component";
import { InitialListComponent } from "./initial-list/initial-list.component";
import { DataTablesModule } from "angular-datatables";
import { FlashViewComponent } from "./flash-view/flash-view.component";
import { ViewListComponent } from "./view-list/view-list.component";
import { BreadcrumbComponent } from "./breadcrumb/breadcrumb.component";
import { FloatingButtonComponent } from "./floating-button/floating-button.component";
import { TourComponent } from "./tour/tour.component";
import { TextViewerComponent } from "./text-viewer/text-viewer.component";
import { UploadFilesComponent } from "./upload-files/upload-files.component";
import { UploadFilesQuestionComponent } from "./upload-files-question/upload-files-question.component";
import { DynamicFormsComponent } from "./dynamic-forms/dynamic-forms.component";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import {
  FilterInitialListComponent,
  FilterInitialListDialog,
} from "./filter-initial-list/filter-initial-list.component";
import { ObservationComponent, ObservationDialog } from "./observation-dialog/observation-dialog.component";
import { ViewDependenciesComponent } from "./view-dependencies/view-dependencies.component";
import { FormModalComponent, modalDialog } from "./form-modal/form-modal.component";
import { UploadFilesModalComponent, UploadFilesDialog } from "./upload-files-modal/upload-files-modal.component";
import {
  UploadMassiveFilesModalComponent,
  UploadMassiveFilesDialog,
} from "./upload-massive-files-modal/upload-massive-files-modal.component";
import { UploadMassiveFilesDetailModalComponent } from "./upload-massive-files-detail-modal/upload-massive-files-detail-modal.component";
import { ViewPdfComponent } from "./view-pdf/view-pdf.component";
import { ViewPdfModalComponent, ViewPdfModalDialog } from "./view-pdf-modal/view-pdf-modal.component";
import { IncludeInFileComponent, IncludeInFileDialog } from "./include-in-file/include-in-file.component";
import {
  SimpleTableModalComponent,
  SimpleTableDialog,
  SimpleDialog,
  DigitalSignDialog,
  SimpleDialogOption,
  ViewImageDialog,
} from "./simple-table-modal/simple-table-modal.component";
import {
  ObservationLoansComponent,
  ObservationLoansDialog,
} from "./observation-loans-dialog/observation-loans-dialog.component";
import { ViewHistoryComponent } from "./view-history/view-history.component";
import { SimpleTextModalComponent, SimpleTextDialog } from "./simple-text-modal/simple-text-modal.component";
import { SendReplyMailComponent, SendReplyMailDialog } from "./send-reply-mail-dialog/send-reply-mail-dialog.component";
import { SendMailComponent } from "./send-mail/send-mail.component";

@NgModule({
    declarations: [
        LoadingAppComponent,
        LoadingAuthComponent,
        ErrorsFormsComponent,
        SubMenuComponent,
        InitialListComponent,
        FlashViewComponent,
        ViewListComponent,
        BreadcrumbComponent,
        FloatingButtonComponent,
        TourComponent,
        TextViewerComponent,
        UploadFilesComponent,
        UploadFilesQuestionComponent,
        DynamicFormsComponent,
        FilterInitialListComponent,
        FilterInitialListDialog,
        ObservationComponent,
        ObservationDialog,
        ViewDependenciesComponent,
        modalDialog,
        FormModalComponent,
        UploadFilesModalComponent,
        UploadFilesDialog,
        UploadMassiveFilesModalComponent,
        UploadMassiveFilesDetailModalComponent,
        UploadMassiveFilesDialog,
        ViewPdfComponent,
        ViewPdfModalComponent,
        ViewPdfModalDialog,
        IncludeInFileComponent,
        IncludeInFileDialog,
        SimpleTableModalComponent,
        SimpleTableDialog,
        SimpleDialog,
        DigitalSignDialog,
        SimpleDialogOption,
        ViewImageDialog,
        ObservationLoansComponent,
        ObservationLoansDialog,
        ViewHistoryComponent,
        SimpleTextModalComponent,
        SimpleTextDialog,
        SendReplyMailComponent,
        SendReplyMailDialog,
        SendMailComponent,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        ComponentsRoutingModule,
        DataTablesModule,
        MatButtonModule,
        MatIconModule,
        EcoFabSpeedDialModule,
        MatProgressSpinnerModule,
        MaterialModule,
        MatDialogModule,
        FormlyMaterialModule,
        NgxMatSelectSearchModule,
        FormlyModule,
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
    ],
    exports: [
        LoadingAppComponent,
        LoadingAuthComponent,
        ErrorsFormsComponent,
        SubMenuComponent,
        InitialListComponent,
        FlashViewComponent,
        ViewListComponent,
        BreadcrumbComponent,
        FloatingButtonComponent,
        TourComponent,
        TextViewerComponent,
        UploadFilesComponent,
        UploadFilesQuestionComponent,
        ObservationComponent,
        ViewDependenciesComponent,
        FormModalComponent,
        UploadFilesModalComponent,
        UploadMassiveFilesModalComponent,
        UploadMassiveFilesDetailModalComponent,
        ViewPdfComponent,
        ViewPdfModalComponent,
        IncludeInFileComponent,
        SimpleTableModalComponent,
        ObservationLoansComponent,
        ViewHistoryComponent,
        SimpleTextModalComponent,
        SimpleDialogOption,
        ViewImageDialog,
        SendReplyMailComponent,
        SendMailComponent,
    ],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: "es-ES" }]
})
export class ComponentsModule {}
