'use strict';

define(function () {
    function Message() {
        if (! (this instanceof Message)) {
            throw new Error('`this` must be an instance of view.Message');
        }

        this.show = function (status, message) {
            var div = document.getElementById('flash-message');
            div.setAttribute('class', status);
            div.innerText = message;
            div.style.display = 'block';

            setTimeout(function () {
                div.style.display = 'none';
            }, 3000);
        }
    }

    return Message;
});
