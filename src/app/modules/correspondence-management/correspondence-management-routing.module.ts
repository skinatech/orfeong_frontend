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
import { CorrespondenceManagementMainComponent } from './correspondence-management-main/correspondence-management-main.component';
// Mass Reassignment
import { CorManagMassReassignmentIndexComponent } from './cor-manag-mass-reassignment-index/cor-manag-mass-reassignment-index.component';
// Annulment
import { CorManagAnnulmentIndexComponent } from './cor-manag-annulment-index/cor-manag-annulment-index.component';
// Distribution and Shipping
import { CorManagDistributionShippingIndexComponent }  from './cor-manag-distribution-shipping-index/cor-manag-distribution-shipping-index.component';
import { CorManagDistributionShippingViewComponent } from './cor-manag-distribution-shipping-view/cor-manag-distribution-shipping-view.component';

const routes: Routes = [
  {
    path: 'correspondenceManagement', component: CorrespondenceManagementMainComponent,
    children: [
      // Mass Reassignment
      { path: 'mass-reassignment-index', component: CorManagMassReassignmentIndexComponent },
      // Annulment
      { path: 'annulment-index', component: CorManagAnnulmentIndexComponent },
      // Distribution and Shipping
      { path: 'distribution-shipping-index', component: CorManagDistributionShippingIndexComponent },
      { path: 'distribution-shipping-view/:id', component: CorManagDistributionShippingViewComponent }
     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorrespondenceManagementRoutingModule { }
