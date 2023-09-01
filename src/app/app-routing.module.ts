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
// import { MailboxComponent } from './modules/auth-layout/mailbox/mailbox.component';
// import { UnlockMainComponent } from './modules/unlock/unlock-main/unlock-main.component';
import { LoginMainComponent } from './modules/login/login-main/login-main.component';
import { QrviewMainComponent } from './modules/qrview/qrview-main/qrview-main.component';
import { RegisterMainComponent } from './modules/register/register-main/register-main.component';
import { ResetPassMainComponent } from './modules/reset-pass/reset-pass-main/reset-pass-main.component';
import { ResetTokenPassMainComponent } from './modules/reset-token-pass/reset-token-pass-main/reset-token-pass-main.component';
import { DashboardMainComponent } from './modules/dashboard/dashboard-main/dashboard-main.component';
import { UsersMainComponent } from './modules/users/users-main/users-main.component';
import { SettingsAppMainComponent } from './modules/settings-app/settings-app-main/settings-app-main.component';
import { FilingMainComponent } from './modules/filing/filing-main/filing-main.component';
import { DocManagMainComponent } from './modules/document-management/doc-manag-main/doc-manag-main.component';
import { CorrespondenceManagementMainComponent } from './modules/correspondence-management/correspondence-management-main/correspondence-management-main.component';
import { ArchiveManagementMainComponent } from './modules/archive-management/archive-management-main/archive-management-main.component';
import { DocumentaryLoansMainComponent } from './modules/documentary-loans/documentary-loans-main/documentary-loans-main.component';
import { ReportMainComponent } from './modules/reports/report-main/report-main.component';
import { QueryViewfinderMainComponent } from './modules/query/query-viewfinder-main/query-viewfinder-main.component';
import { AuditMainComponent } from './modules/audit/audit-main/audit-main.component';
import { HelpMainComponent } from './modules/help/help-main/help-main.component';
import { AboutMainComponent } from "./modules/about/about-main/about-main.component";

/**
 * Importación de servicios
 */
import { ValidateTokenGuard } from './guards/validate-token.guard';

const routes: Routes = [

  /** Módulos de la plantilla base que pueden ser utilizados */
  // { path: 'mailbox', component: MailboxComponent },
  // { path: 'unlock', component: UnlockMainComponent },

  /** Módulos donde NO se necesita estar logueado */
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginMainComponent },
  { path: 'register', component: RegisterMainComponent },
  { path: 'qrview/:params', component: QrviewMainComponent },
  { path: 'resetpass', component: ResetPassMainComponent },
  { path: 'resettokenpass/:params', component: ResetTokenPassMainComponent },

  /** Módulos donde se necesita estar logueado */
  { path: 'dashboard', component: DashboardMainComponent, canActivate: [ValidateTokenGuard] },
  { path: 'users', component: UsersMainComponent, canActivate: [ValidateTokenGuard] },
  { path: 'filing', component: FilingMainComponent, canActivate: [ValidateTokenGuard] },
  { path: 'setting', component: SettingsAppMainComponent, canActivate: [ValidateTokenGuard] },
  { path: 'documentManagement', component: DocManagMainComponent, canActivate: [ValidateTokenGuard] },
  { path: 'correspondenceManagement', component: CorrespondenceManagementMainComponent, canActivate: [ValidateTokenGuard] },
  { path: 'archiveManagement', component: ArchiveManagementMainComponent, canActivate: [ValidateTokenGuard] },
  { path: 'documentaryLoans', component: DocumentaryLoansMainComponent, canActivate: [ValidateTokenGuard] },
  { path: 'reports', component: ReportMainComponent, canActivate: [ValidateTokenGuard] },
  { path: 'query', component: QueryViewfinderMainComponent, canActivate: [ValidateTokenGuard] },
  { path: 'audit', component: AuditMainComponent, canActivate: [ValidateTokenGuard] },
  { path: 'help', component: HelpMainComponent, canActivate: [ValidateTokenGuard] },
  { path: "about", component: AboutMainComponent, canActivate: [ValidateTokenGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }