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
import { Routes, RouterModule } from "@angular/router";
/**
 * Importación de componentes
 */
import { SettingsAppMainComponent } from "./settings-app-main/settings-app-main.component";
// Carga TRD
import { SettingsAppUploadTrdIndexComponent } from "./settings-app-upload-trd-index/settings-app-upload-trd-index.component";
import { SettingsAppUploadTrdCreateComponent } from "./settings-app-upload-trd-create/settings-app-upload-trd-create.component";
import { SettingsAppUploadTrdUpdateComponent } from "./settings-app-upload-trd-update/settings-app-upload-trd-update.component";
import { SettingsAppUploadTrdViewComponent } from "./settings-app-upload-trd-view/settings-app-upload-trd-view.component";
// Providers
import { SettingsAppProvidersIndexComponent } from "./settings-app-providers-index/settings-app-providers-index.component";
import { SettingsAppProvidersCreateComponent } from "./settings-app-providers-create/settings-app-providers-create.component";
import { SettingsAppProvidersUpdateComponent } from "./settings-app-providers-update/settings-app-providers-update.component";
import { SettingsAppProvidersViewComponent } from "./settings-app-providers-view/settings-app-providers-view.component";
// Filing types
import { SettingsAppFilingTypesIndexComponent } from "./settings-app-filing-types-index/settings-app-filing-types-index.component";
import { SettingsAppFilingTypesCreateComponent } from "./settings-app-filing-types-create/settings-app-filing-types-create.component";
import { SettingsAppFilingTypesUpdateComponent } from "./settings-app-filing-types-update/settings-app-filing-types-update.component";
import { SettingsAppFilingTypesViewComponent } from "./settings-app-filing-types-view/settings-app-filing-types-view.component";
// User groups
import { SettingsAppUserGroupsIndexComponent } from "./settings-app-user-groups-index/settings-app-user-groups-index.component";
import { SettingsAppUserGroupsCreateComponent } from "./settings-app-user-groups-create/settings-app-user-groups-create.component";
import { SettingsAppUserGroupsUpdateComponent } from "./settings-app-user-groups-update/settings-app-user-groups-update.component";
import { SettingsAppUserGroupsViewComponent } from "./settings-app-user-groups-view/settings-app-user-groups-view.component";
// Tiempos de respuesta
import { SettingsAppTimesResponseIndexComponent } from "./settings-app-times-response-index/settings-app-times-response-index.component";
import { SettingsAppTimesResponseCreateComponent } from "./settings-app-times-response-create/settings-app-times-response-create.component";
import { SettingsAppTimesResponseUpdateComponent } from "./settings-app-times-response-update/settings-app-times-response-update.component";
import { SettingsAppTimesResponseViewComponent } from "./settings-app-times-response-view/settings-app-times-response-view.component";
// Non-working days
import { SettingsAppNonWorkingIndexComponent } from "./settings-app-non-working-index/settings-app-non-working-index.component";
import { SettingsAppNonWorkingCreateComponent } from "./settings-app-non-working-create/settings-app-non-working-create.component";
import { SettingsAppNonWorkingUpdateComponent } from "./settings-app-non-working-update/settings-app-non-working-update.component";
// Templates
import { SettingsAppTemplatesIndexComponent } from "./settings-app-templates-index/settings-app-templates-index.component";
import { SettingsAppTemplatesCreateComponent } from "./settings-app-templates-create/settings-app-templates-create.component";
import { SettingsAppTemplatesUpdateComponent } from "./settings-app-templates-update/settings-app-templates-update.component";
// Variables template
import { SettingsAppTemVariablesIndexComponent } from "./settings-app-tem-variables-index/settings-app-tem-variables-index.component";
import { SettingsAppTemVariablesCreateComponent } from "./settings-app-tem-variables-create/settings-app-tem-variables-create.component";
import { SettingsAppTemVariablesUpdateComponent } from "./settings-app-tem-variables-update/settings-app-tem-variables-update.component";
// Signature
import { SettingsAppSignatureComponent } from "./settings-app-signature/settings-app-signature.component";
// Providers external
import { SettingsAppProvidesExternalIndexComponent } from "./settings-app-provides-external-index/settings-app-provides-external-index.component";
import { SettingsAppProvidesExternalCreateComponent } from "./settings-app-provides-external-create/settings-app-provides-external-create.component";
import { SettingsAppProvidesExternalUpdateComponent } from "./settings-app-provides-external-update/settings-app-provides-external-update.component";
import { SettingsAppProvidesExternalViewComponent } from "./settings-app-provides-external-view/settings-app-provides-external-view.component";
// Templates Isolucion
import { SettingsAppTemplatesIsolucionIndexComponent } from "./settings-app-templates-isolucion-index/settings-app-templates-isolucion-index.component";
// Polls
import { SettingsAppPollIndexComponent } from "./settings-app-poll-index/settings-app-poll-index.component";
import { SettingsAppPollCreateComponent } from "./settings-app-poll-create/settings-app-poll-create.component";
import { SettingsAppPollUpdateComponent } from "./settings-app-poll-update/settings-app-poll-update.component";
import { SettingsAppPollViewComponent } from "./settings-app-poll-view/settings-app-poll-view.component";
// Main and Region
import { SettingsAppRegionIndexComponent } from "./settings-app-region-index/settings-app-region-index.component";
import { SettingsAppRegionCreateComponent } from "./settings-app-region-create/settings-app-region-create.component";
import { SettingsAppRegionUpdateComponent } from "./settings-app-region-update/settings-app-region-update.component";
import { SettingsAppRegionViewComponent } from "./settings-app-region-view/settings-app-region-view.component";
import { SettingsAppRegionMassiveComponent } from "./settings-app-region-massive/settings-app-region-massive.component";
// Filing Setting
import { SettingsAppFilingSettingUpdateComponent } from "./settings-app-filing-setting-update/settings-app-filing-setting-update.component";
// General Setting
import { SettingsAppGeneralSettingUpdateComponent } from "./settings-app-general-setting-update/settings-app-general-setting-update.component";
// Filing Label Setting
import { SettingsAppFilingLabelIndexComponent } from "./settings-app-filing-label-index/settings-app-filing-label-index.component";
// Third Party Management
import { SettingsAppThirdManagementIndexComponent } from './settings-app-third-management-index/settings-app-third-management-index.component';
import { SettingsAppThirdManagementCreateComponent } from './settings-app-third-management-create/settings-app-third-management-create.component';
import { SettingsAppThirdManagementUpdateComponent } from './settings-app-third-management-update/settings-app-third-management-update.component';
import { SettingsAppThirdManagementViewComponent } from './settings-app-third-management-view/settings-app-third-management-view.component';
import { SettingsAppThirdManagementMassiveComponent } from './settings-app-third-management-massive/settings-app-third-management-massive.component';
// Certified Signatures
import { SettingsAppCertifiedSignaturesIndexComponent } from './settings-app-certified-signatures-index/settings-app-certified-signatures-index.component';
import { SettingsAppCertifiedSignaturesCreateComponent } from './settings-app-certified-signatures-create/settings-app-certified-signatures-create.component';
import { SettingsAppCertifiedSignaturesUpdateComponent } from './settings-app-certified-signatures-update/settings-app-certified-signatures-update.component';
import { SettingsAppCertifiedSignaturesViewComponent } from './settings-app-certified-signatures-view/settings-app-certified-signatures-view.component';

const routes: Routes = [
  {
    path: "setting",
    component: SettingsAppMainComponent,
    children: [
      { path: "upload-trd-index", component: SettingsAppUploadTrdIndexComponent },
      { path: "upload-trd-create", component: SettingsAppUploadTrdCreateComponent },
      { path: "upload-trd-update/:id", component: SettingsAppUploadTrdUpdateComponent },
      { path: "upload-trd-view/:id", component: SettingsAppUploadTrdViewComponent },
      // Providers
      { path: "providers-index", component: SettingsAppProvidersIndexComponent },
      { path: "providers-create", component: SettingsAppProvidersCreateComponent },
      { path: "providers-update/:id", component: SettingsAppProvidersUpdateComponent },
      { path: "providers-view/:id", component: SettingsAppProvidersViewComponent },
      // Tipos de radicado
      { path: "filing-types-index", component: SettingsAppFilingTypesIndexComponent },
      { path: "filing-types-create/:typeResolutions", component: SettingsAppFilingTypesCreateComponent },
      { path: "filing-types-update/:id/:typeResolutions", component: SettingsAppFilingTypesUpdateComponent },
      { path: "filing-types-view/:id/:typeResolutions", component: SettingsAppFilingTypesViewComponent },
      // User groups
      { path: "user-groups-index", component: SettingsAppUserGroupsIndexComponent },
      { path: "user-groups-create", component: SettingsAppUserGroupsCreateComponent },
      { path: "user-groups-update/:id", component: SettingsAppUserGroupsUpdateComponent },
      { path: "user-groups-view/:id", component: SettingsAppUserGroupsViewComponent },
      // Tiempos de respuesta
      { path: "times-response-index", component: SettingsAppTimesResponseIndexComponent },
      { path: "times-response-create", component: SettingsAppTimesResponseCreateComponent },
      { path: "times-response-update/:id", component: SettingsAppTimesResponseUpdateComponent },
      { path: "times-response-view/:id", component: SettingsAppTimesResponseViewComponent },
      // Non-working days
      { path: "non-working-days-index", component: SettingsAppNonWorkingIndexComponent },
      { path: "non-working-days-create", component: SettingsAppNonWorkingCreateComponent },
      { path: "non-working-days-update/:id", component: SettingsAppNonWorkingUpdateComponent },
      // Templates
      { path: "templates-index", component: SettingsAppTemplatesIndexComponent },
      { path: "templates-create", component: SettingsAppTemplatesCreateComponent },
      { path: "templates-update/:id", component: SettingsAppTemplatesUpdateComponent },
      // Variables templates
      { path: "templates-variables-index", component: SettingsAppTemVariablesIndexComponent },
      { path: "templates-variables-create", component: SettingsAppTemVariablesCreateComponent },
      { path: "templates-variables-update/:id", component: SettingsAppTemVariablesUpdateComponent },
      // Signature
      { path: "signature-update", component: SettingsAppSignatureComponent },
      // Providers external
      { path: "providers-external-index", component: SettingsAppProvidesExternalIndexComponent },
      { path: "providers-external-create", component: SettingsAppProvidesExternalCreateComponent },
      { path: "providers-external-update/:id", component: SettingsAppProvidesExternalUpdateComponent },
      { path: "providers-external-view/:id", component: SettingsAppProvidesExternalViewComponent },
      // Templates Isolucion
      { path: "templates-isolucion-index", component: SettingsAppTemplatesIsolucionIndexComponent },
      // Polls
      { path: "poll-index", component: SettingsAppPollIndexComponent },
      { path: "poll-create", component: SettingsAppPollCreateComponent },
      { path: "poll-update/:id", component: SettingsAppPollUpdateComponent },
      { path: "poll-view/:id", component: SettingsAppPollViewComponent },
      // Main and Region
      { path: "region-index", component: SettingsAppRegionIndexComponent },
      { path: "region-create", component: SettingsAppRegionCreateComponent },
      { path: "region-update/:id", component: SettingsAppRegionUpdateComponent },
      { path: "region-view/:id", component: SettingsAppRegionViewComponent },
      { path: "region-massive", component: SettingsAppRegionMassiveComponent },
      // Filing Setting
      { path: "filing-setting-update", component: SettingsAppFilingSettingUpdateComponent },
      // General Setting
      { path: "general-setting-update", component: SettingsAppGeneralSettingUpdateComponent },
      // Filing Label Setting
      { path: "filing-label-index", component: SettingsAppFilingLabelIndexComponent },
      // Third Party Management
      { path: 'third-management-index', component: SettingsAppThirdManagementIndexComponent },
      { path: 'third-management-create', component: SettingsAppThirdManagementCreateComponent },
      { path: 'third-management-update/:id', component: SettingsAppThirdManagementUpdateComponent },
      { path: 'third-management-view/:id', component: SettingsAppThirdManagementViewComponent },
      { path: 'third-management-massive', component: SettingsAppThirdManagementMassiveComponent },
      // Certified Signatures
      { path: 'certified-signatures-index', component: SettingsAppCertifiedSignaturesIndexComponent },
      { path: 'certified-signatures-create', component: SettingsAppCertifiedSignaturesCreateComponent },
      { path: 'certified-signatures-update/:id', component: SettingsAppCertifiedSignaturesUpdateComponent },
      { path: 'certified-signatures-view/:id', component: SettingsAppCertifiedSignaturesViewComponent },

      { path: "third-management-index", component: SettingsAppThirdManagementIndexComponent },
      { path: "third-management-create", component: SettingsAppThirdManagementCreateComponent },
      { path: "third-management-update/:id", component: SettingsAppThirdManagementUpdateComponent },
      { path: "third-management-view/:id", component: SettingsAppThirdManagementViewComponent },
      { path: "third-management-massive", component: SettingsAppThirdManagementMassiveComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsAppRoutingModule {}
