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
import { UsersMainComponent } from './users-main/users-main.component';
/** Usuarios */
import { UsersUsersIndexComponent } from './users-users-index/users-users-index.component';
import { UsersUsersCreateComponent } from './users-users-create/users-users-create.component';
import { UsersUsersUpdateComponent } from './users-users-update/users-users-update.component';
import { UsersUsersViewComponent } from './users-users-view/users-users-view.component';

/** Roles */
import { UsersRolesIndexComponent } from './users-roles-index/users-roles-index.component';
import { UsersRolesCreateComponent } from './users-roles-create/users-roles-create.component';
import { UsersRolesUpdateComponent } from './users-roles-update/users-roles-update.component';
import { UsersRolesViewComponent } from './users-roles-view/users-roles-view.component';

/** Operaciones */
import { UsersOperationsIndexComponent } from './users-operations-index/users-operations-index.component';
import { UsersOperationsCreateComponent } from './users-operations-create/users-operations-create.component';
import { UsersOperationsUpdateComponent } from './users-operations-update/users-operations-update.component';

/** Tipos documentales */
import { UsersDocumentaryTypesComponent } from './users-documentary-types/users-documentary-types.component'

/** masiva */
import { UsersMassiveComponent } from './users-massive/users-massive.component';
import { UsersFilingTypesComponent } from './users-filing-types/users-filing-types.component';

const routes: Routes = [
  {
    path: 'users', component: UsersMainComponent,
    children: [
      /** Usuarios */
      { path: 'users-index/:params', component: UsersUsersIndexComponent },
      { path: 'users-create', component: UsersUsersCreateComponent },
      { path: 'users-update/:id', component: UsersUsersUpdateComponent },
      { path: 'users-view/:id', component: UsersUsersViewComponent },
      /** Roles / Perfiles */
      { path: 'roles-index', component: UsersRolesIndexComponent },
      { path: 'roles-create', component: UsersRolesCreateComponent },
      { path: 'roles-update/:id', component: UsersRolesUpdateComponent },
      { path: 'roles-view/:id', component: UsersRolesViewComponent },
      /** Roles / Operaciones */
      { path: 'operations-index', component: UsersOperationsIndexComponent },
      { path: 'operations-create', component: UsersOperationsCreateComponent },
      { path: 'operations-update/:id', component: UsersOperationsUpdateComponent },
      /** Tipos documentales */
      { path: 'documentary-types-update/:id/:name', component: UsersDocumentaryTypesComponent },
      /** Tipos de radicado */
      { path: 'filing-types-update/:id/:name', component: UsersFilingTypesComponent },
      /** masiva */
      { path: 'users-massive', component: UsersMassiveComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
