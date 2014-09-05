'use strict';

define(function () {
    function Message() {
        if (! (this instanceof Message)) {
            throw new Error('`this` must be an instance of view.Message');
        }

        var WINDOW_WIDTH = 630;

        this.show = function (status, message) {
            var div = document.getElementById('flash-message');
            div.setAttribute('class', status);
            div.innerText = message;
            div.style.display = 'block';

            // center message depending on its width
            var leftOffset = WINDOW_WIDTH / 2 - Math.round(div.offsetWidth / 2);
            div.style.left = leftOffset + 'px';


            setTimeout(function () {
                div.innerText = '';
                div.setAttribute('class', '');
                div.style.display = 'none';
            }, 3000);
        }
    }

    Message.status = {
        ERROR: 'error',
        INFO:  'info'
    };

    return Message;
});
