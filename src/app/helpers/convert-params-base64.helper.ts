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

export function ConvertParamsBase64Helper(string: string): any {

    string = string.replace(/_/g, '/');
    string = string.replace(/-/g, '+');

    return decodeURIComponent(Array.prototype.map.call(atob(string), (c) => {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        }).join("") ) ;
}
