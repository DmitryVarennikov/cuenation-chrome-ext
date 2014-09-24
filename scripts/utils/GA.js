'use strict';

function GA(mode) {
    if (!(this instanceof GA)) {
        throw new Error('`this` must be an instance of utils.GA');
    }

    (function () {
        var ga = document.createElement('script');
        ga.type = 'text/javascript';
        ga.async = true;
        ga.src = 'https://ssl.google-analytics.com/ga.js';

        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ga, s);
    })();

    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-10762441-2']);


    this.trackPageview = function () {
        if ('prod' === mode) {
            _gaq.push(['_trackPageview']);
        }
    }

    this.trackEvent = function (name) {
        if ('prod' === mode) {
            _gaq.push(['_trackEvent', name, 'clicked']);
        }
    }
}


define(['scripts/utils/mode'], function (mode) {

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