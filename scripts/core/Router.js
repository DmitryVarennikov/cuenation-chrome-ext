'use strict';

define(function () {
    function Router(cuesView, categoriesView) {
        if (! (this instanceof Router)) {
            throw new Error('`this` must be an instance of core.Router');
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
