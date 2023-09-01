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

import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { ChangeChildrenService } from "../../../services/change-children.service";

@Component({
  selector: "app-login-licensing-message",
  templateUrl: "./login-licensing-message.component.html",
  styleUrls: ["./login-licensing-message.component.css"],
})
export class LoginLicensingMessageComponent implements OnInit {

  disabledAcceptLicense = true;
  termsAndConditions = false;
  habeasData = false;
  dataCheckbox = [
    { name: "termsAndConditions", value: false },
    { name: "habeasData", value: false },
  ];

  constructor(private changeChildrenService: ChangeChildrenService) {}

  ngOnInit(): void {}

  login() {
    this.changeChildrenService.requestToModal({ proccess: "close", continue: true });
  }

  close() {
    this.changeChildrenService.requestToModal({ proccess: "close", continue: false });
  }

  changeCheckbox(event: { type: string; event: any }) {
    this.dataCheckbox.forEach((item) => {
      if (item.name === event.type) {
        item.value = event.event.target.checked;
      }
    });

    this.validateDataCheckbox();
  }

  validateDataCheckbox() {
    const cantValid = this.dataCheckbox.filter((item) => item.value === true);
    if (this.dataCheckbox.length === cantValid.length) {
      this.disabledAcceptLicense = false;
    } else {
      this.disabledAcceptLicense = true;
    }
  }

}
