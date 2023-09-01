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
import { CorrespondenceManagementRoutingModule } from "./correspondence-management-routing.module";
import { AdminLayoutModule } from "../admin-layout/admin-layout.module";
import { ComponentsModule } from "../components/components.module";
/**
 * Gestión correspondencia
 */
import { CorrespondenceManagementMainComponent } from "./correspondence-management-main/correspondence-management-main.component";
import { CorManagMassReassignmentIndexComponent } from "./cor-manag-mass-reassignment-index/cor-manag-mass-reassignment-index.component";
import { CorManagAnnulmentIndexComponent } from "./cor-manag-annulment-index/cor-manag-annulment-index.component";
import { CorManagDistributionShippingIndexComponent } from "./cor-manag-distribution-shipping-index/cor-manag-distribution-shipping-index.component";
import { CorManagDistributionShippingViewComponent } from "./cor-manag-distribution-shipping-view/cor-manag-distribution-shipping-view.component";

@NgModule({
  declarations: [
    CorrespondenceManagementMainComponent,
    CorManagMassReassignmentIndexComponent,
    CorManagAnnulmentIndexComponent,
    CorManagDistributionShippingIndexComponent,
    CorManagDistributionShippingViewComponent,
  ],
  imports: [
    CommonModule,
    CorrespondenceManagementRoutingModule,
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
export class CorrespondenceManagementModule {}
