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
import { ArchiveManagementMainComponent } from './archive-management-main/archive-management-main.component';
// physical space
import { ArcManagPhysicalSpaceIndexComponent } from './arc-manag-physical-space-index/arc-manag-physical-space-index.component';
import { ArcManagPhysicalSpaceCreateComponent } from './arc-manag-physical-space-create/arc-manag-physical-space-create.component';
import { ArcManagPhysicalSpaceUpdateComponent } from './arc-manag-physical-space-update/arc-manag-physical-space-update.component';
import { ArcManagPhysicalSpaceViewComponent } from './arc-manag-physical-space-view/arc-manag-physical-space-view.component';
// Archive filing
import { ArcManagArchiveFilingIndexComponent } from './arc-manag-archive-filing-index/arc-manag-archive-filing-index.component';
import { ArcManagArchiveLocationComponent } from './arc-manag-archive-location/arc-manag-archive-location.component';
// Documentary transfer
import { ArcManagDocuTransferIndexComponent } from './arc-manag-docu-transfer-index/arc-manag-docu-transfer-index.component';

const routes: Routes = [
  {
    path: 'archiveManagement', component: ArchiveManagementMainComponent,
    children: [
      // physical space
      { path: 'physical-space-index', component: ArcManagPhysicalSpaceIndexComponent },
      { path: 'physical-space-create', component: ArcManagPhysicalSpaceCreateComponent },
      { path: 'physical-space-update/:id', component: ArcManagPhysicalSpaceUpdateComponent },
      { path: 'physical-space-view/:id', component: ArcManagPhysicalSpaceViewComponent },
      // Archive filing
      { path: 'archive-filing-index', component: ArcManagArchiveFilingIndexComponent },
      { path: 'archive-location/:id', component: ArcManagArchiveLocationComponent },
      // Documentary transfer
      { path: 'documentary-transfer-index', component: ArcManagDocuTransferIndexComponent },
      { path: 'documentary-transfer-index/:params', component: ArcManagDocuTransferIndexComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArchiveManagementRoutingModule { }
