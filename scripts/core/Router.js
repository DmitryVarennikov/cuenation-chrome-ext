'use strict';

define(['scripts/view/View'], function (View) {
    function Router(cuesView, categoriesView) {
        if (! (this instanceof Router)) {
            throw new Error('`this` must be an instance of core.Router');
        }
        if (! (cuesView instanceof View)) {
            throw new Error('`recentCuesView` must be an instance of view.View');
        }
        if (! (categoriesView instanceof View)) {
            throw new Error('`categoriesView` must be an instance of view.View');
        }

        var routes = {
            "cues":       cuesView.render,
            "categories": categoriesView.render
        };

        /**
         * @param {String} route
         * @returns {Function}
         */
        this.getCallback = function (route) {
            if (! routes[route]) {
                throw new Error('Unrecognized route "' + route + '"');
            }

            return routes[route];
        }
    }

    return Router;
});
