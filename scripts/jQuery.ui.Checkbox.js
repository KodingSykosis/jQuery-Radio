/*jslint sub:true,laxbreak:true,browser:true*/
/*globals jQuery,WebKitMutationObserver*/

/***
 *      Author: KodingSykosis
 *        Date: 12/17/2013
 *     Version: 1.0.0
 *     License: GPL v3 (see License.txt or http://www.gnu.org/licenses/)
 * Description: This widget provides a stylible checkbox button
 *
 *        Name: kodingsykosis.checkbox
 *
 *    Requires: jQueryUI 1.8.2 or better
 ***/
(function ($) {
    $.widget("kodingsykosis.checkbox", $.kodingsykosis.radio, {
        options: { },
        baseClass: 'ui-checkbox'
    });
})(jQuery);