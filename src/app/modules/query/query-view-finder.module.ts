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

import { QueryViewFinderRoutingModule } from "./query-view-finder-routing.module";
import { AdminLayoutModule } from "../admin-layout/admin-layout.module";
import { ComponentsModule } from "../components/components.module";
// Query Viewfinder
import { QueryViewfinderMainComponent } from "./query-viewfinder-main/query-viewfinder-main.component";
import { QueryViewfinderIndexComponent } from "./query-viewfinder-index/query-viewfinder-index.component";
import { QueryViewfinderViewComponent } from "./query-viewfinder-view/query-viewfinder-view.component";
import { QueryFolderAdiIndexComponent } from "./query-folder-adi-index/query-folder-adi-index.component";
import { QueryFolderAdiViewComponent } from "./query-folder-adi-view/query-folder-adi-view.component";
import { AdvancedIndexComponent } from "./advanced-index/advanced-index.component";
import { QueryOldOrfeoIndexComponent } from "./query-old-orfeo-index/query-old-orfeo-index.component";
import { QueryOldOrfeoViewComponent } from "./query-old-orfeo-view/query-old-orfeo-view.component";
import { AccumulatedFundComponent } from "./accumulated-fund/accumulated-fund.component";

@NgModule({
  declarations: [
    QueryViewfinderMainComponent,
    QueryViewfinderIndexComponent,
    QueryViewfinderViewComponent,
    QueryFolderAdiIndexComponent,
    QueryFolderAdiViewComponent,
    AdvancedIndexComponent,
    QueryOldOrfeoIndexComponent,
    QueryOldOrfeoViewComponent,
    AccumulatedFundComponent,
  ],
  imports: [
    CommonModule,
    QueryViewFinderRoutingModule,
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
export class QueryViewFinderModule {}
