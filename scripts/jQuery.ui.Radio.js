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

    $.fn.checked = function(isChecked) {
        if (typeof isChecked === 'boolean') {
            return this.each(function() {
                var elem = $(this);

                //Why would you do such a thing
                if (!elem.is('[type="checkbox"],[type="radio"]')) {
                    return;
                }

                elem.prop('checked', isChecked);

                var stateMgr = elem.data('setState');
                if (stateMgr) {
                    stateMgr(isChecked);
                }
            });
        }
    };

    $.widget("kodingsykosis.radio", {
        options: {
            label: '~ label'
        },
        baseClass: 'ui-radio',


        /***********************************
        **     jQueryUI Widget Interface
        ***********************************/
        _create: function () {
            this.label =
                this.element
                    .find(this.options['label']);

            this.element
                .hide()
                .watch('disabled', $.proxy(this._onStateChanged, this))
                .add(this.label)
                .wrapAll('<div>');

            this._clsOuter = this.baseClass + '-outer';
            this._clsChecked = this.baseClass + '-checked';


            //This should add an outer & inner circles
            this.outer =
                this.element
                    .parent()
                    .addClass(this._clsOuter)
                    .on('click', $.proxy(this._onOuterClicked, this));

            this.inner = $('<div>', {
                'class': this.baseClass,
                'prependTo': this.outer
            });

            if (this.element.prop('type') === 'radio') {
                this.group = '[name="' +
                    this.element
                        .prop('name') +
                    '"]';
            }

            this.element
                .data('setState', $.proxy(this.checked, this));
        },

        _init: function () {
            this.checked(this.element.prop('checked') === true);
        },

        _destroy: function () {
            this.element
                .unwrap()
                .show();
        },

        /***********************************
        **     Public methods
        ***********************************/

        toggle: function() {
            this.checked(!this.checked());
        },

        checked: function(isChecked) {
            if (typeof isChecked === 'boolean') {
                this.inner
                    .toggleClass(this._clsChecked, isChecked);

                this.element
                    .prop('checked', isChecked);

                this.element
                    .change();

                if (isChecked && this.group) {
                    var selector = '.' + this._clsChecked + ' ~ ' + this.group;
                    $(selector).not(this.element)
                               [this.widgetName]('checked', false);
                }
            }

            return this.inner.is('.' + this._clsChecked);
        },

        disable: function() {
            this._super();

            this.outer
                .addClass('ui-state-disabled');
        },

        enable: function() {
            this._super();

            this.outer
                .removeClass('ui-state-disabled');
        },

        /***********************************
        **     Helper Methods
        ***********************************/

        /***********************************
        **     Event Delegates
        ***********************************/

        _onStateChanged: function() {
            if (this.element.prop('disabled')) {
                this.disable();
            } else {
                this.enable();
            }
        },

        _onOuterClicked: function () {
            if (this.outer.is('.ui-state-disabled')) return;
            if (this.group) {
                this.checked(true);
            } else {
                this.toggle();
            }
        }
    });
})(jQuery);
