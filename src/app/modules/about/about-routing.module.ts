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
import { RouterModule, Routes } from "@angular/router";

import { AboutMainComponent } from "./about-main/about-main.component";
import { AboutViewComponent } from "./about-view/about-view.component";

const routes: Routes = [
  {
    path: "about",
    component: AboutMainComponent,
    children: [{ path: "about-view/:id", component: AboutViewComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AboutRoutingModule {}
