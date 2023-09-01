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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AdminLayoutRoutingModule } from './admin-layout-routing.module';
import { AdminTopNavBarComponent } from './admin-top-nav-bar/admin-top-nav-bar.component';
import { AdminAsideNavBarComponent } from './admin-aside-nav-bar/admin-aside-nav-bar.component';
import { AdminFooterNavBarComponent } from './admin-footer-nav-bar/admin-footer-nav-bar.component';

@NgModule({
  declarations: [
    AdminTopNavBarComponent,
    AdminAsideNavBarComponent,
    AdminFooterNavBarComponent
  ],
  imports: [
    CommonModule,
    AdminLayoutRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http);
        },
        deps: [ HttpClient ]
      }
    }),
  ],
  exports: [
    AdminTopNavBarComponent,
    AdminAsideNavBarComponent,
    AdminFooterNavBarComponent
  ],
})
export class AdminLayoutModule { }
