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
import { HttpClientModule } from "@angular/common/http";
import { MatInputModule } from "@angular/material/input";

import { QrviewRoutingModule } from "./qrview-routing.module";
import { QrviewMainComponent } from "./qrview-main/qrview-main.component";

import { AuthLayoutModule } from "../auth-layout/auth-layout.module";

@NgModule({
  declarations: [QrviewMainComponent],
  imports: [
    CommonModule,
    QrviewRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    HttpClientModule,
    AuthLayoutModule,
  ],
})
export class QrviewModule {}
