'use strict';

function GA(mode) {
    if (!(this instanceof GA)) {
        throw new Error('`this` must be an instance of utils.GA');
    }

    if ('prod' === mode) {
        _gaq.push(['_setAccount', 'UA-10762441-2']);
    }

    this.trackPageview = function () {
        if ('prod' === mode) {
            _gaq.push(['_trackPageview']);
        }
    }

    this.trackClickEvent = function (name) {
        if ('prod' === mode) {
            _gaq.push(['_trackEvent', name, 'clicked']);
        }
    }
}


define(['google-analytics', 'scripts/utils/mode'], function (_, mode) {

    var ga;

    return {
        getInstance: function () {
            if (!(ga instanceof GA)) {
                ga = new GA(mode);
            }

            return ga;
        }
    };

});