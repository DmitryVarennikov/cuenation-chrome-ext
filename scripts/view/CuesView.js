'use strict';

define([
    'scripts/view/View',
    'scripts/view/Message'
], function (View, MessageView) {
    function CuesView(container, messageView, user, userCueService, userCueCategoryService) {
        if (! (this instanceof CuesView)) {
            throw new Error('`this` must be an instance of view.CuesView');
        }

        View.call(this, container);

        var cuesView = this;

        /**
         * @param {domain.Cue[]} cues
         * @param {domain.CueCategory[]} userCategories
         */
        function render(cues, userCategories) {
            var forEach = Array.prototype.forEach,
                containerBody = document.createDocumentFragment(),
                cuesList,
                text;

            cuesList = document.createElement('ul');
            cuesList.setAttribute('id', 'recent-cues');

            function createCuesListItem(cue) {
                var li,
                    a,
                    span,
                    whitespace;

                a = document.createElement('a');
                a.setAttribute('href', cue.link);
                a.setAttribute('target', '_blank');
                a.innerText = cue.title;

                span = document.createElement('span');
                span.setAttribute('class', 'delete');
                span.dataset.id = cue.id;
                span.innerText = '[Dismiss]';

                whitespace = document.createTextNode(' ');

                li = document.createElement('li');
                li.appendChild(a);
                li.appendChild(whitespace);
                li.appendChild(span);

                return li;
            }

            for (var i = 0; i < cues.length; i ++) {
                cuesList.appendChild(createCuesListItem(cues[i]));
            }

            containerBody.appendChild(cuesList);


            container.innerHTML = '';

            if (0 === cues.length) {
                text = document.createElement('div');
                text.setAttribute('id', 'no-cues');

                if (0 === userCategories.length) {
                    text.innerText = 'You are not subscribed for any category yet!';
                } else {
                    text.innerText = 'No new cues :(';
                }
                container.appendChild(text);
            } else {
                container.appendChild(containerBody);
            }
        }

        function listenToDelete() {
            var forEach = Array.prototype.forEach;

            forEach.call(container.querySelectorAll('.delete'), function (el) {
                el.addEventListener('click', function (e) {
                    var ids = [this.dataset.id];

                    this.parentElement.remove();
                    userCueService.put(user.token, ids, function (err) {
                        if (err) {
                            messageView.show(MessageView.status.ERROR, err);
                        }
                    });
                });
            });
        }

        this.render = function () {
            cuesView.renderLoader();

            var _cues,
                _userCategories;

            function caller() {
                if (typeof _cues != 'undefined' && typeof _userCategories != 'undefined') {
                    render(_cues, _userCategories);
                    listenToDelete();
                }
            }

            userCueService.get(user.token, 0, function (err, cues, pageable) {
                if (err) {
                    messageView.show('error', err);
                } else {
                    _cues = cues;
                    caller();
                }
            });

            userCueCategoryService.get(user.token, function (err, userCategories) {
                if (err) {
                    messageView.show('error', err);
                } else {
                    _userCategories = userCategories;
                    caller();
                }
            });
        }
    }

    CuesView.prototype = Object.create(View.prototype);
    CuesView.prototype.constructor = CuesView;

    return CuesView;
});
