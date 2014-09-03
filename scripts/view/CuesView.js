'use strict';

define(['scripts/view/View'], function (View) {
    function CuesView(container, messageView, user, userCueService) {
        if (! (this instanceof CuesView)) {
            throw new Error('`this` must be an instance of view.CuesView');
        }

        View.call(this);

        function render(cues, pageable) {
            var forEach = Array.prototype.forEach,
                item,
                h1,
                ul,
                li,
                a,
                span,
                whitespace;

            ul = document.createElement('ul');
            ul.setAttribute('id', 'recent-cues');

            for (var i = 0; i < cues.length; i ++) {
                item = cues[i];

                a = document.createElement('a');
                a.setAttribute('href', item.link);
                a.setAttribute('target', '_blank');
                a.innerText = item.title;

                span = document.createElement('span');
                span.setAttribute('class', 'delete');
                span.dataset.id = item.id;
                span.innerText = '[Dismiss]';

                whitespace = document.createTextNode(' ');

                li = document.createElement('li');
                li.appendChild(a);
                li.appendChild(whitespace);
                li.appendChild(span);

                ul.appendChild(li);
            }

            h1 = document.createElement('h1');
            h1.setAttribute('class', 'page-title');
            h1.innerText = 'Cues';


            container.innerHTML = '';
            container.appendChild(h1);
            container.appendChild(ul);


            forEach.call(ul.querySelectorAll('.delete'), function (el) {
                el.addEventListener('click', function (e) {
                    var ids = [this.dataset.id];

                    this.parentElement.remove();
                    userCueService.put(user.token, ids, function (err) {
                        if (err) {
                            messageView.show('error', err);
                        }
                    });
                });
            });
        }

        this.render = function () {
            userCueService.get(user.token, 0, function (err, cues, pageable) {
                if (err) {
                    messageView.show('error', err);
                } else {
                    render(cues, pageable);
                }
            });
        }
    }

    CuesView.prototype = Object.create(View.prototype);
    CuesView.prototype.constructor = CuesView;

    return CuesView;
});
