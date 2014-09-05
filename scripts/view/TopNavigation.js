'use strict';

define(function () {
    function TopNavigation(router) {
        if (! (this instanceof TopNavigation)) {
            throw new Error('`this` must be an instance of view.TopNavigation');
        }

        var forEach = Array.prototype.forEach;
        // listen to navigation links click event
        forEach.call(document.getElementById('menu').querySelectorAll('a'), function (el) {
            el.addEventListener('click', function (e) {
                e.preventDefault();

                forEach.call(document.getElementById('menu').querySelectorAll('a'), function (el) {
                    el.removeAttribute('class');
                });
                el.setAttribute('class', 'active');

                var callback = router.getCallback(this.getAttribute('href'));
                callback();
            });
        });
    }

    return TopNavigation;
});
