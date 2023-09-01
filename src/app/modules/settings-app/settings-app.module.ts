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
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { MaterialModule } from "../../app.material.module";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { BnNgIdleService } from 'bn-ng-idle';
/**
 * Importación de modulos
 */
import { SettingsAppRoutingModule } from "./settings-app-routing.module";
import { AdminLayoutModule } from "../admin-layout/admin-layout.module";
import { ComponentsModule } from "../components/components.module";
import { SettingsAppMainComponent } from "./settings-app-main/settings-app-main.component";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";

/** Upload TRD */
import { SettingsAppDocumentaryTypesComponent } from "./settings-app-documentary-types/settings-app-documentary-types.component";
import { SettingsAppUploadTrdFormComponent } from "./settings-app-upload-trd-form/settings-app-upload-trd-form.component";
import { SettingsAppUploadTrdIndexComponent } from "./settings-app-upload-trd-index/settings-app-upload-trd-index.component";
import { SettingsAppUploadTrdCreateComponent } from "./settings-app-upload-trd-create/settings-app-upload-trd-create.component";
import { SettingsAppUploadTrdUpdateComponent } from "./settings-app-upload-trd-update/settings-app-upload-trd-update.component";
import { SettingsAppUploadTrdViewComponent } from "./settings-app-upload-trd-view/settings-app-upload-trd-view.component";
/** Providers */
import { SettingsAppProvidersIndexComponent } from "./settings-app-providers-index/settings-app-providers-index.component";
import { SettingsAppProvidersFormComponent } from "./settings-app-providers-form/settings-app-providers-form.component";
import { SettingsAppProvidersCreateComponent } from "./settings-app-providers-create/settings-app-providers-create.component";
import { SettingsAppProvidersUpdateComponent } from "./settings-app-providers-update/settings-app-providers-update.component";
import { SettingsAppProvidersViewComponent } from "./settings-app-providers-view/settings-app-providers-view.component";
// Tipos radicados
import { SettingsAppFilingTypesIndexComponent } from "./settings-app-filing-types-index/settings-app-filing-types-index.component";
import { SettingsAppFilingTypesCreateComponent } from "./settings-app-filing-types-create/settings-app-filing-types-create.component";
import { SettingsAppFilingTypesUpdateComponent } from "./settings-app-filing-types-update/settings-app-filing-types-update.component";
import { SettingsAppFilingTypesFormComponent } from "./settings-app-filing-types-form/settings-app-filing-types-form.component";
import { SettingsAppFilingTypesViewComponent } from "./settings-app-filing-types-view/settings-app-filing-types-view.component";
// User groups
import { SettingsAppUserGroupsIndexComponent } from "./settings-app-user-groups-index/settings-app-user-groups-index.component";
import { SettingsAppUserGroupsCreateComponent } from "./settings-app-user-groups-create/settings-app-user-groups-create.component";
import { SettingsAppUserGroupsFormComponent } from "./settings-app-user-groups-form/settings-app-user-groups-form.component";
import { SettingsAppUserGroupsUpdateComponent } from "./settings-app-user-groups-update/settings-app-user-groups-update.component";
import { SettingsAppUserGroupsViewComponent } from "./settings-app-user-groups-view/settings-app-user-groups-view.component";
// Tiempos de respuesta
import { SettingsAppTimesResponseIndexComponent } from "./settings-app-times-response-index/settings-app-times-response-index.component";
import { SettingsAppTimesResponseCreateComponent } from "./settings-app-times-response-create/settings-app-times-response-create.component";
import { SettingsAppTimesResponseFormComponent } from "./settings-app-times-response-form/settings-app-times-response-form.component";
import { SettingsAppTimesResponseUpdateComponent } from "./settings-app-times-response-update/settings-app-times-response-update.component";
import { SettingsAppTimesResponseViewComponent } from "./settings-app-times-response-view/settings-app-times-response-view.component";
// Non-working days
import { SettingsAppNonWorkingIndexComponent } from "./settings-app-non-working-index/settings-app-non-working-index.component";
import { SettingsAppNonWorkingFormComponent } from "./settings-app-non-working-form/settings-app-non-working-form.component";
import { SettingsAppNonWorkingCreateComponent } from "./settings-app-non-working-create/settings-app-non-working-create.component";
import { SettingsAppNonWorkingUpdateComponent } from "./settings-app-non-working-update/settings-app-non-working-update.component";
import { SettingsAppTemplatesIndexComponent } from "./settings-app-templates-index/settings-app-templates-index.component";
import { SettingsAppTemplatesCreateComponent } from "./settings-app-templates-create/settings-app-templates-create.component";
import { SettingsAppTemplatesUpdateComponent } from "./settings-app-templates-update/settings-app-templates-update.component";
import { SettingsAppSignatureComponent } from "./settings-app-signature/settings-app-signature.component";
// Proveedores externos
import { SettingsAppProvidesExternalIndexComponent } from "./settings-app-provides-external-index/settings-app-provides-external-index.component";
import { SettingsAppProvidesExternalViewComponent } from "./settings-app-provides-external-view/settings-app-provides-external-view.component";
import { SettingsAppProvidesExternalUpdateComponent } from "./settings-app-provides-external-update/settings-app-provides-external-update.component";
import { SettingsAppProvidesExternalCreateComponent } from "./settings-app-provides-external-create/settings-app-provides-external-create.component";
import { SettingsAppProvidesExternalFormComponent } from "./settings-app-provides-external-form/settings-app-provides-external-form.component";
import { SettingsAppTemplatesIsolucionIndexComponent } from "./settings-app-templates-isolucion-index/settings-app-templates-isolucion-index.component";
// Poll
import { SettingsAppPollIndexComponent } from "./settings-app-poll-index/settings-app-poll-index.component";
import { SettingsAppPollCreateComponent } from "./settings-app-poll-create/settings-app-poll-create.component";
import { SettingsAppPollFormComponent } from "./settings-app-poll-form/settings-app-poll-form.component";
import { SettingsAppPollUpdateComponent } from "./settings-app-poll-update/settings-app-poll-update.component";
import { SettingsAppPollViewComponent } from "./settings-app-poll-view/settings-app-poll-view.component";
import { SettingsAppRegionIndexComponent } from "./settings-app-region-index/settings-app-region-index.component";
import { SettingsAppRegionFormComponent } from "./settings-app-region-form/settings-app-region-form.component";
import { SettingsAppRegionCreateComponent } from "./settings-app-region-create/settings-app-region-create.component";
import { SettingsAppRegionUpdateComponent } from "./settings-app-region-update/settings-app-region-update.component";
import { SettingsAppRegionViewComponent } from "./settings-app-region-view/settings-app-region-view.component";
import { SettingsAppRegionMassiveComponent } from "./settings-app-region-massive/settings-app-region-massive.component";
import { SettingsAppFilingSettingUpdateComponent } from "./settings-app-filing-setting-update/settings-app-filing-setting-update.component";
import { SettingsAppGeneralSettingUpdateComponent } from "./settings-app-general-setting-update/settings-app-general-setting-update.component";
import { SettingsAppFilingLabelIndexComponent } from "./settings-app-filing-label-index/settings-app-filing-label-index.component";
import { SettingsAppThirdManagementIndexComponent } from "./settings-app-third-management-index/settings-app-third-management-index.component";
import { SettingsAppThirdManagementFormComponent } from "./settings-app-third-management-form/settings-app-third-management-form.component";
import { SettingsAppThirdManagementCreateComponent } from "./settings-app-third-management-create/settings-app-third-management-create.component";
import { SettingsAppThirdManagementUpdateComponent } from "./settings-app-third-management-update/settings-app-third-management-update.component";
import { SettingsAppThirdManagementViewComponent } from "./settings-app-third-management-view/settings-app-third-management-view.component";
import { SettingsAppThirdManagementMassiveComponent } from "./settings-app-third-management-massive/settings-app-third-management-massive.component";
// Variables de combinación
import { SettingsAppTemVariablesIndexComponent } from "./settings-app-tem-variables-index/settings-app-tem-variables-index.component";
import { SettingsAppTemVariablesCreateComponent } from "./settings-app-tem-variables-create/settings-app-tem-variables-create.component";
import { SettingsAppTemVariablesFormComponent } from "./settings-app-tem-variables-form/settings-app-tem-variables-form.component";
import { SettingsAppTemVariablesUpdateComponent } from "./settings-app-tem-variables-update/settings-app-tem-variables-update.component";
// Firma Certificada
import { SettingsAppCertifiedSignaturesIndexComponent } from './settings-app-certified-signatures-index/settings-app-certified-signatures-index.component';
import { SettingsAppCertifiedSignaturesViewComponent } from './settings-app-certified-signatures-view/settings-app-certified-signatures-view.component';
import { SettingsAppCertifiedSignaturesUpdateComponent } from './settings-app-certified-signatures-update/settings-app-certified-signatures-update.component';
import { SettingsAppCertifiedSignaturesCreateComponent } from './settings-app-certified-signatures-create/settings-app-certified-signatures-create.component';
import { SettingsAppCertifiedSignaturesFormComponent } from './settings-app-certified-signatures-form/settings-app-certified-signatures-form.component';

@NgModule({
  declarations: [
    SettingsAppDocumentaryTypesComponent,
    SettingsAppMainComponent,
    SettingsAppUploadTrdFormComponent,
    SettingsAppUploadTrdIndexComponent,
    SettingsAppUploadTrdCreateComponent,
    SettingsAppUploadTrdUpdateComponent,
    SettingsAppUploadTrdViewComponent,
    SettingsAppProvidersIndexComponent,
    SettingsAppProvidersFormComponent,
    SettingsAppProvidersCreateComponent,
    SettingsAppProvidersUpdateComponent,
    SettingsAppProvidersViewComponent,
    SettingsAppFilingTypesIndexComponent,
    SettingsAppFilingTypesCreateComponent,
    SettingsAppFilingTypesUpdateComponent,
    SettingsAppFilingTypesFormComponent,
    SettingsAppFilingTypesViewComponent,
    SettingsAppUserGroupsIndexComponent,
    SettingsAppUserGroupsCreateComponent,
    SettingsAppUserGroupsFormComponent,
    SettingsAppUserGroupsUpdateComponent,
    SettingsAppUserGroupsViewComponent,
    SettingsAppTimesResponseIndexComponent,
    SettingsAppTimesResponseCreateComponent,
    SettingsAppTimesResponseFormComponent,
    SettingsAppTimesResponseUpdateComponent,
    SettingsAppTimesResponseViewComponent,
    SettingsAppNonWorkingIndexComponent,
    SettingsAppNonWorkingFormComponent,
    SettingsAppNonWorkingCreateComponent,
    SettingsAppNonWorkingUpdateComponent,
    SettingsAppTemplatesIndexComponent,
    SettingsAppTemplatesCreateComponent,
    SettingsAppTemplatesUpdateComponent,
    SettingsAppSignatureComponent,
    SettingsAppTemVariablesIndexComponent,
    SettingsAppProvidesExternalIndexComponent,
    SettingsAppProvidesExternalViewComponent,
    SettingsAppProvidesExternalUpdateComponent,
    SettingsAppProvidesExternalCreateComponent,
    SettingsAppProvidesExternalFormComponent,
    SettingsAppTemplatesIsolucionIndexComponent,
    SettingsAppPollIndexComponent,
    SettingsAppPollCreateComponent,
    SettingsAppPollFormComponent,
    SettingsAppPollUpdateComponent,
    SettingsAppPollViewComponent,
    SettingsAppRegionIndexComponent,
    SettingsAppRegionFormComponent,
    SettingsAppRegionCreateComponent,
    SettingsAppRegionUpdateComponent,
    SettingsAppRegionViewComponent,
    SettingsAppRegionMassiveComponent,
    SettingsAppFilingSettingUpdateComponent,
    SettingsAppGeneralSettingUpdateComponent,
    SettingsAppFilingLabelIndexComponent,
    SettingsAppThirdManagementIndexComponent,
    SettingsAppThirdManagementFormComponent,
    SettingsAppThirdManagementCreateComponent,
    SettingsAppThirdManagementUpdateComponent,
    SettingsAppThirdManagementViewComponent,
    SettingsAppThirdManagementMassiveComponent,
    SettingsAppCertifiedSignaturesIndexComponent,
    SettingsAppCertifiedSignaturesViewComponent,
    SettingsAppCertifiedSignaturesUpdateComponent,
    SettingsAppCertifiedSignaturesCreateComponent,
    SettingsAppCertifiedSignaturesFormComponent,
    SettingsAppTemVariablesCreateComponent,
    SettingsAppTemVariablesFormComponent,
    SettingsAppTemVariablesUpdateComponent,
  ],
  imports: [
    CommonModule,
    SettingsAppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http);
        },
        deps: [HttpClient],
      },
    }),
    /**
     * Modulos
     */
    AdminLayoutModule,
    ComponentsModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    NgxMaterialTimepickerModule,
  ],
  exports: [ComponentsModule],
  providers: [BnNgIdleService]
})
export class SettingsAppModule {}
