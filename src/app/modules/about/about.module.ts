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
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { BnNgIdleService } from 'bn-ng-idle';

import { AdminLayoutModule } from "../admin-layout/admin-layout.module";
import { ComponentsModule } from "../components/components.module";

import { AboutRoutingModule } from "./about-routing.module";
import { AboutMainComponent } from "./about-main/about-main.component";
import { AboutViewComponent } from "./about-view/about-view.component";

@NgModule({
  declarations: [AboutMainComponent, AboutViewComponent],
  imports: [
    CommonModule,
    AboutRoutingModule,
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
    AdminLayoutModule,
    ComponentsModule,
  ],
  providers: [BnNgIdleService]
})
export class AboutModule {}
