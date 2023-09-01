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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConvertParamsBase64Helper } from 'src/app/helpers/convert-params-base64.helper';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-doc-manag-dependencies-version-view',
  templateUrl: './doc-manag-dependencies-version-view.component.html',
  styleUrls: ['./doc-manag-dependencies-version-view.component.css']
})
export class DocManagDependenciesVersionViewComponent implements OnInit {

  // Codigo de la dependencia
  paramiD: any; // Base 64
  paramOID: any; // Codigo dependencia correcto
  // Data a enviar de las dependencias
  dataIdDepe: any = [];
  // Ruta para consultar
  reuteLoadView: string = 'gestionDocumental/trd/get-version';
  // Ruta a redirigir
  redirectionPath = '/documentManagement/dependencies-index';
  /** BreadcrumbOn  */
  breadcrumbOn = [
    { 'name': 'Gestión documental', 'route': '/documentManagement' },
    { 'name': 'Dependencias', 'route': this.redirectionPath }
  ];

  breadcrumbRouteActive = 'Versionamiento TRD';

  constructor(private route: ActivatedRoute, private authService: AuthService) {
    this.paramiD = this.route.snapshot.paramMap.get('id'); // SE recibe el id
    this.paramOID = ConvertParamsBase64Helper(this.paramiD); // Se pasa al html como componete para que reciba el ID
    this.dataIdDepe.push(this.paramOID);
    // console.log(this.paramOID);
    // Asigna el valor al localstorage
    localStorage.setItem( environment.dataIdDepe, this.authService.encryptAES(this.dataIdDepe, false) );
  }

  ngOnInit() {
  }

}
