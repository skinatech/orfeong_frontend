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

import { UnlockRoutingModule } from "./unlock-routing.module";
import { MatInputModule } from "@angular/material/input";

/**
 * Importación de componentes
 */
import { UnlockMainComponent } from "./unlock-main/unlock-main.component";

/**
 * Importación de módulos
 */
import { AuthLayoutModule } from "../auth-layout/auth-layout.module";

@NgModule({
  declarations: [UnlockMainComponent],
  imports: [
    CommonModule,
    UnlockRoutingModule,
    MatInputModule,
    /**
     * Modulos
     */
    AuthLayoutModule,
  ],
})
export class UnlockModule {}
