'use strict';

define(function () {
    function View() {
        if (! (this instanceof View)) {
            throw new Error('`this` must be an instance of view.View');
        }

        this.render = function () {
            throw new Error('Not implemented!');
        }
    }

    return View;
});
