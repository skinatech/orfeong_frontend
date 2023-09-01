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
import { DocManagMainComponent } from "./doc-manag-main/doc-manag-main.component";
/** Dependences */
import { DocManagDependenciesIndexComponent } from "./doc-manag-dependencies-index/doc-manag-dependencies-index.component";
import { DocManagDependenciesCreateComponent } from "./doc-manag-dependencies-create/doc-manag-dependencies-create.component";
import { DocManagDependenciesUpdateComponent } from "./doc-manag-dependencies-update/doc-manag-dependencies-update.component";
import { DocManagDependenciesViewComponent } from "./doc-manag-dependencies-view/doc-manag-dependencies-view.component";
import { DocManagDependenciesVersionViewComponent } from "./doc-manag-dependencies-version-view/doc-manag-dependencies-version-view.component";
import { DocManagDependenciesVersionEditComponent } from "./doc-manag-dependencies-version-edit/doc-manag-dependencies-version-edit.component";
/** Carga de TRD */
import { DocManagUploadTrdComponent } from "./doc-manag-upload-trd/doc-manag-upload-trd.component";
/** Versionamiento de TRD */
import { DocManagVersionTrdIndexComponent } from "./doc-manag-version-trd-index/doc-manag-version-trd-index.component";
import { DocManagVersionTrdViewComponent } from "./doc-manag-version-trd-view/doc-manag-version-trd-view.component";
// Expedientes
import { DocManagFolderIndexComponent } from "./doc-manag-folder-index/doc-manag-folder-index.component";
import { DocManagFolderUpdateComponent } from "./doc-manag-folder-update/doc-manag-folder-update.component";
import { DocManagFolderViewComponent } from "./doc-manag-folder-view/doc-manag-folder-view.component";
// import { DocManagFolderFormComponent } from './doc-manag-folder-form/doc-manag-folder-form.component';
import { DocManagFolderCreateComponent } from "./doc-manag-folder-create/doc-manag-folder-create.component";
import { DocManagFolderIndIndexComponent } from "./doc-manag-folder-ind-index/doc-manag-folder-ind-index.component";

const routes: Routes = [
  {
    path: "documentManagement",
    component: DocManagMainComponent,
    children: [
      // Dependencias
      { path: "dependencies-index", component: DocManagDependenciesIndexComponent },
      { path: "dependencies-create", component: DocManagDependenciesCreateComponent },
      { path: "dependencies-update/:id", component: DocManagDependenciesUpdateComponent },
      { path: "dependencies-view/:id", component: DocManagDependenciesViewComponent },
      { path: "dependencies-version-view/:id", component: DocManagDependenciesVersionViewComponent },
      { path: "dependencies-version-edit/:id", component: DocManagDependenciesVersionEditComponent },
      /** Carga TRG */
      { path: "upload-trd", component: DocManagUploadTrdComponent },
      /** Versionamiento TRG */
      { path: "version-trd-index", component: DocManagVersionTrdIndexComponent },
      { path: "version-trd-view/:id", component: DocManagVersionTrdViewComponent },
      // Expedientes
      { path: "folder-index/:params", component: DocManagFolderIndexComponent },
      { path: "folder-create", component: DocManagFolderCreateComponent },
      { path: "folder-create/:radiSelected", component: DocManagFolderCreateComponent },
      { path: "folder-update/:id", component: DocManagFolderUpdateComponent },
      { path: "folder-view/:id", component: DocManagFolderViewComponent },
      { path: "folder-ind-index/:id", component: DocManagFolderIndIndexComponent },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentManagementRoutingModule {}
