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
 * Importación de componentes
 */
import { ReportMainComponent } from './report-main/report-main.component';
// Reports
import { ReportIndexComponent } from './report-index/report-index.component';
import { ReportsCustomComponent } from './reports-custom/reports-custom.component';

const routes: Routes = [
  {
    path: 'reports', component: ReportMainComponent,
    children: [
      // Audit Log
      { path: 'reports-index', component: ReportIndexComponent },
      { path: 'reports-custom', component: ReportsCustomComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
