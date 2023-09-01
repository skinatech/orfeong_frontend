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
import { AuditMainComponent } from './audit-main/audit-main.component';
// Audit Log
import { AuditLogIndexComponent } from './audit-log-index/audit-log-index.component';
import { AuditLogViewComponent } from './audit-log-view/audit-log-view.component';

const routes: Routes = [
  {
    path: 'audit', component: AuditMainComponent,
    children: [
      // Audit Log
      { path: 'log-audit-index', component: AuditLogIndexComponent },
      { path: 'log-audit-view/:id', component: AuditLogViewComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditRoutingModule { }
