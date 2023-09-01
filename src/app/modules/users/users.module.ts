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
import { UsersRoutingModule } from "./users-routing.module";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient, HttpClientModule } from "@angular/common/http";

import { MaterialModule } from "../../app.material.module";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { BnNgIdleService } from 'bn-ng-idle';

/**
 * Importación de componentes
 */
import { UsersMainComponent } from "./users-main/users-main.component";
/** Usuarios */
import { UsersUsersCreateComponent } from "./users-users-create/users-users-create.component";
import { UsersUsersUpdateComponent } from "./users-users-update/users-users-update.component";
import { UsersUsersFormComponent } from "./users-users-form/users-users-form.component";
import { UsersUsersViewComponent } from "./users-users-view/users-users-view.component";
/** Roles */
import { UsersRolesIndexComponent } from "./users-roles-index/users-roles-index.component";
import { UsersRolesFormComponent } from "./users-roles-form/users-roles-form.component";
import { UsersRolesCreateComponent } from "./users-roles-create/users-roles-create.component";
import { UsersRolesUpdateComponent } from "./users-roles-update/users-roles-update.component";
import { UsersRolesViewComponent } from "./users-roles-view/users-roles-view.component";

/**
 * Importación de módulos
 */
import { AdminLayoutModule } from "../admin-layout/admin-layout.module";
import { ComponentsModule } from "../components/components.module";
import { UsersOperationsFormComponent } from "./users-operations-form/users-operations-form.component";
import { UsersOperationsIndexComponent } from "./users-operations-index/users-operations-index.component";
import { UsersOperationsCreateComponent } from "./users-operations-create/users-operations-create.component";
import { UsersOperationsUpdateComponent } from "./users-operations-update/users-operations-update.component";
import { UsersUsersIndexComponent } from "./users-users-index/users-users-index.component";
import { UsersDocumentaryTypesComponent } from "./users-documentary-types/users-documentary-types.component";
import { UsersMassiveComponent } from "./users-massive/users-massive.component";
import { UsersFilingTypesComponent } from "./users-filing-types/users-filing-types.component";
//

@NgModule({
  declarations: [
    UsersMainComponent,
    UsersUsersIndexComponent,
    UsersUsersCreateComponent,
    UsersUsersUpdateComponent,
    UsersUsersFormComponent,
    UsersUsersViewComponent,
    UsersRolesIndexComponent,
    UsersRolesFormComponent,
    UsersRolesCreateComponent,
    UsersRolesUpdateComponent,
    UsersRolesViewComponent,
    UsersOperationsFormComponent,
    UsersOperationsIndexComponent,
    UsersOperationsCreateComponent,
    UsersOperationsUpdateComponent,
    UsersDocumentaryTypesComponent,
    UsersMassiveComponent,
    UsersFilingTypesComponent,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
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
  ],
  exports: [UsersUsersFormComponent, UsersRolesFormComponent],
  providers: [BnNgIdleService]
})
export class UsersModule {}
