'use strict';

define(function () {
    function View(container) {
        if (! (this instanceof View)) {
            throw new Error('`this` must be an instance of view.View');
        }

        this.renderLoader = function () {
            var loader = document.createElement('img');
            loader.setAttribute('src', 'images/loader.gif');
            loader.setAttribute('width', '32');
            loader.setAttribute('height', '32');
            loader.setAttribute('id', 'loader');

            container.innerHTML = '';
            container.appendChild(loader);
        }

        this.render = function () {
            throw new Error('Not implemented!');
        }
    }

    return View;
});
