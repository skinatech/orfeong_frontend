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

import { RegisterRoutingModule } from "./register-routing.module";
//import { MaterialModule } from '../../app.material.module';

/**
 * Importación de componentes
 */
import { RegisterMainComponent } from "./register-main/register-main.component";

/**
 * Importación de módulos
 */
import { AuthLayoutModule } from "../auth-layout/auth-layout.module";
import { ComponentsModule } from "../components/components.module";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

@NgModule({
  declarations: [RegisterMainComponent],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    //MaterialModule,
    /**
     * Modulos
     */
    AuthLayoutModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class RegisterModule {}
