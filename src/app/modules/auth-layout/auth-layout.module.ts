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

import { AuthLayoutRoutingModule } from './auth-layout-routing.module';

/**
 * Importación de componentes
 */
import { AuthNavComponent } from './auth-nav/auth-nav.component';
import { AuthFooterComponent } from './auth-footer/auth-footer.component';

import { MailboxComponent } from './mailbox/mailbox.component';

@NgModule({
  declarations: [
    AuthNavComponent,
    AuthFooterComponent,
    MailboxComponent
  ],
  imports: [
    CommonModule,
    AuthLayoutRoutingModule
  ],
  exports: [
    AuthNavComponent,
    AuthFooterComponent
  ]
})
export class AuthLayoutModule { }
