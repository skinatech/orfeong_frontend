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
import { DocumentaryLoansRoutingModule } from "./documentary-loans-routing.module";
import { AdminLayoutModule } from "../admin-layout/admin-layout.module";
import { ComponentsModule } from "../components/components.module";
// Documentary loans main
import { DocumentaryLoansMainComponent } from "./documentary-loans-main/documentary-loans-main.component";
// Apply for loan
import { DocLoansApplyForLoanIndexComponent } from "./doc-loans-apply-for-loan-index/doc-loans-apply-for-loan-index.component";
import { DocLoansManageLoanIndexComponent } from "./doc-loans-manage-loan-index/doc-loans-manage-loan-index.component";
import { DocLoansHistoryLoanComponent } from "./doc-loans-history-loan/doc-loans-history-loan.component";
import { DocLoansLoanOfFilesIndexComponent } from "./doc-loans-of-files-index/doc-loans-loan-of-files-index.component";
import { DocLoansManageLoanOfFilesIndexComponent } from "./doc-loans-manage-loan-of-files-index/doc-loans-manage-loan-of-files-index.component";

@NgModule({
  declarations: [
    DocumentaryLoansMainComponent,
    DocLoansApplyForLoanIndexComponent,
    DocLoansManageLoanIndexComponent,
    DocLoansHistoryLoanComponent,
    DocLoansLoanOfFilesIndexComponent,
    DocLoansManageLoanOfFilesIndexComponent,
  ],
  imports: [
    CommonModule,
    DocumentaryLoansRoutingModule,
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
export class DocumentaryLoansModule {}
