'use strict';

define(function () {
    function TopNavigation(router, ga) {
        if (!(this instanceof TopNavigation)) {
            throw new Error('`this` must be an instance of view.TopNavigation');
        }

        var forEach = Array.prototype.forEach;
        // listen to navigation links click event
        forEach.call(document.getElementById('menu').querySelectorAll('a.inner'), function (el) {
            el.addEventListener('click', function (e) {
                e.preventDefault();

                // track clicks with GA
                ga.trackClickEvent(this.getAttribute('href'));


                forEach.call(document.getElementById('menu').children, function (el) {
                    el.removeAttribute('class');
                });
                el.parentNode.setAttribute('class', 'active');

                var callback = router.getCallback(this.getAttribute('href'));
                callback();
            });
        });

        window.addEventListener('scroll', function () {
            var menu = document.getElementById('menu');

            if (document.body.scrollTop >= 110) {
                menu.setAttribute('class', 'clear menu-fixed-to-top');
            } else {
                menu.setAttribute('class', 'clear ');
            }
        });
    }

    return TopNavigation;
});
