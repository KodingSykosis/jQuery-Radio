/*jslint sub:true,laxbreak:true,browser:true*/
/*globals jQuery,WebKitMutationObserver*/

/***
 *      Author: KodingSykosis
 *        Date: 12/17/2013
 *     Version: 1.0.0
 *     License: GPL v3 (see License.txt or http://www.gnu.org/licenses/)
 * Description: This widget provides a stylible radio button
 *
 *        Name: kodingsykosis.radio
 *
 *    Requires: jQueryUI 1.8.2 or better
 ***/
(function ($) {
    //http://darcyclarke.me/development/detect-attribute-changes-with-jquery
    //http://jsfiddle.net/kodingsykosis/k3Q72/
    if (typeof $.fn.watch === 'undefined')
    $.fn.watch = function (props, callback) {
        return this.each(function () {
            var elem = $(this),
                prop = (elem.data('watching') || []).concat(props.split(' '));

            (function(fn) {
                elem.data('watching', prop);
                elem.on('mutation DOMAttrModified propertychange', function (e) {
                    var propName = e.attributeName || e.originalEvent.propertyName;
                    var _props = $(this).data('watching');
                    if (_props.indexOf(propName) > -1) {
                        fn.apply(this, arguments);
                    }
                });
            })(callback);

            //Stupid IE8 and it's undefined error shit
            var mutationObserver = (typeof WebKitMutationObserver === 'undefined'
                                    ? (typeof MutationObserver === 'undefined'
                                       ? undefined
                                       : MutationObserver)
                                    : WebKitMutationObserver);

            //Support MutationObservers
            if (typeof mutationObserver !== 'undefined') {
                var observer = new mutationObserver(function (mutations) {
                    mutations.forEach(function (e) {
                        var evt = $.Event('mutation', e);
                        evt.type = 'mutation';
                        $(e.target).triggerHandler(evt);
                    });
                });

                observer.observe(this, { attributes: true, subtree: false });
            }
        });
    };

    //FixMe: http://bugs.jqueryui.com/ticket/8932
    var orgHeight = $.fn.height;
    $.fn.height = function (height) {
        if (!height || this.css('box-sizing') !== 'border-box') {
            return orgHeight.apply(this, arguments);
        }

        var paddingTop = this.css('padding-top'),
            paddingBottom = this.css('padding-bottom'),
            paddingVert = parseFloat(paddingTop || 0) + parseFloat(paddingBottom || 0);

        return orgHeight.call(this, height - paddingVert);
    };


    $.widget("kodingsykosis.radio", {
        options: {
        },


        /***********************************
        **     jQueryUI Widget Interface
        ***********************************/
        _create: function () {
            this.element
                .hide()
                .watch('checked', $.proxy(this._onSourceValueChanged, this))
                .wrap('<div>');


            //This should add an outer & inner circles
            this.outer =
                this.element
                    .parent()
                    .addClass('ui-radio-outer')
                    .on('click.radio', $.proxy(this._onOuterClicked, this));

            this.inner =
                this.outer
                    .append('<em class="ui-radio-inner"></em>');

            this.group =
                this.element
                    .prop('name');
        },

        _init: function () {
            this._onSourceValueChanged();
        },

        _destroy: function () {
            this.inner
                .remove();

            this.element
                .unwrap()
                .show();
        },

        /***********************************
        **     Public methods
        ***********************************/

        checked: function(isChecked) {
            if (typeof isChecked === 'boolean') {
                this.outer
                    .toggleClass('ui-radio-checked', isChecked);

                this.element
                    .change();

                if (isChecked) {
                    var selector = '.ui-radio-checked [name="' + this.group + '"]';
                    var fullWidgetName = this.widgetFullName;
                    $(selector).not(this.element)
                               .radio('checked', false);
                }
            }

            return this.outer.is('.ui-radio-checked');
        },

        /***********************************
        **     Helper Methods
        ***********************************/

        /***********************************
        **     Event Delegates
        ***********************************/

        _onSourceValueChanged: function() {
            this.checked(this.element.val() === true);
        },

        _onOuterClicked: function() {
            this.checked(true);
        }
    });
})(jQuery);