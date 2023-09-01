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
import { Routes, RouterModule } from '@angular/router';
/**
 * Importación de componentes Generales
 */
import { FilingMainComponent } from './filing-main/filing-main.component';
// Standard Filing
import { FilingIndexComponent } from './filing-index/filing-index.component';
import { FilingCreateComponent } from './filing-create/filing-create.component';
import { FilingUpdateComponent } from './filing-update/filing-update.component';
import { FilingViewComponent } from './filing-view/filing-view.component';
// Email Filing
import { FilingEmailIndexComponent } from './filing-email-index/filing-email-index.component';
import { FilingEmailFormComponent } from './filing-email-form/filing-email-form.component';
import { FilingEmailLoginComponent } from './filing-email-login/filing-email-login.component';

 const routes: Routes = [
  {
    path: 'filing', component: FilingMainComponent,
    children: [
      { path: 'filing-index/:params', component: FilingIndexComponent },
      { path: 'filing-create', component: FilingCreateComponent },
      { path: 'filing-create/:params', component: FilingCreateComponent },
      { path: 'filing-update/:id', component: FilingUpdateComponent },
      { path: 'filing-view/:id', component: FilingViewComponent },
      // Email Filing
      { path: 'filing-email-login', component: FilingEmailLoginComponent },
      { path: 'filing-email-index', component: FilingEmailIndexComponent },
      { path: 'filing-email-form', component: FilingEmailFormComponent }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilingRoutingModule { }
