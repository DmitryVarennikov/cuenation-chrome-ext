'use strict';

define(function () {
    function Message() {
        if (! (this instanceof Message)) {
            throw new Error('`this` must be an instance of view.Message');
        }

        var WINDOW_WIDTH = 630;

        this.show = function (status, message) {
            var messageEl = document.getElementById('flash-message');
            messageEl.setAttribute('class', status);
            messageEl.innerText = message;
            messageEl.style.display = 'block';

            // center messageEl depending on its width
            var leftOffset = WINDOW_WIDTH / 2 - Math.round(messageEl.offsetWidth / 2);
            messageEl.style.left = leftOffset + 'px';
            // and always display on top regardless of the scroll position
            messageEl.style.top = document.body.scrollTop + 'px';


            setTimeout(function () {
                messageEl.innerText = '';
                messageEl.setAttribute('class', '');
                messageEl.style.display = 'none';
            }, 3000);

            window.addEventListener('scroll', function () {
                var messageEl = document.getElementById('flash-message');
                if (messageEl.style.display !== 'none') {
                    messageEl.style.top = document.body.scrollTop + 'px';
                }
            });
        }
    }

    Message.status = {
        ERROR: 'error',
        INFO:  'info'
    };

    return Message;
});
