'use strict';

define([
    'scripts/view/View',
    'scripts/view/Message'
], function (View, MessageView) {
    function CategoriesView(container, messageView, user, cueCategoryService, userCueCategoryService) {
        if (! (this instanceof CategoriesView)) {
            throw new Error('`this` must be an instance of view.CategoriesView');
        }

        View.call(this, container);

        var categoriesView = this;


        window.addEventListener('scroll', function () {
            var topControlsContainer = document.getElementById('top-controls-container');

            if (! topControlsContainer) {
                return;
            }

            console.log(new Date());

            if (document.body.scrollTop >= 153) {
                topControlsContainer.setAttribute('class', 'letter-container clear top-controls-container-fixed');
            } else {
                topControlsContainer.setAttribute('class', 'letter-container clear ');
            }
        });


        function render(categories, userCategories) {
            var forEach = Array.prototype.forEach,
                containerBody = document.createDocumentFragment(),
                topControlsContainer,
                controlsContainer,
                alphabet = [],
                categoriesNavigation,
                categoriesNavigationEl,
                letterContainers = document.createDocumentFragment(),
                letterContainer,
                button;


            button = document.createElement('button');
            button.setAttribute('name', 'save');
            button.innerText = 'Save';

            categoriesNavigation = document.createElement('ul');
            categoriesNavigation.setAttribute('id', 'categories-navigation');

            topControlsContainer = document.createElement('div');
            topControlsContainer.setAttribute('id', 'top-controls-container');
            topControlsContainer.setAttribute('class', 'letter-container clear');
            topControlsContainer.appendChild(button);
            topControlsContainer.appendChild(categoriesNavigation);

            /**
             *
             * @param {String} letter
             * @param {domain.CueCategory[]} categories
             * @returns {Array}
             */
            function sliceCategories(letter, categories) {
                var sliced = [];

                function equals(searchable, given) {
                    if ('#' === searchable) {
                        var re = /[^a-z]/i;
                        return re.test(given);
                    } else {
                        return given.toUpperCase() === searchable;
                    }
                }

                for (var i = 0, j = 0; i < categories.length; i ++) {
                    if (equals(letter, categories[i].name[0])) {
                        sliced[j] = categories[i];
                        j ++;
                    }
                }

                return sliced;
            }

            function createCategoriesNavigationElement(char) {
                var a = document.createElement('a');
                a.setAttribute('href', '#abc-' + char);
                a.innerText = char;

                var li = document.createElement('li');
                li.appendChild(a);

                return li;
            }

            function createLetterContainer(char, categories, userCategories) {
                var label, input, name, host;

                function isChecked(id) {
                    for (var i = 0; i < userCategories.length; i ++) {
                        if (userCategories[i].id === id) {
                            return true;
                        }
                    }

                    return false;
                }

                var letterContainer = document.createElement('div');
                letterContainer.setAttribute('class', 'letter-container');
                letterContainer.setAttribute('id', 'abc-' + char);

                var letter = document.createElement('div');
                letter.setAttribute('class', char);
                letter.innerText = char;

                var categoriesList = document.createElement('div');
                categoriesList.setAttribute('class', 'categories-list');

                for (var i = 0; i < categories.length; i ++) {
                    input = document.createElement('input');
                    input.setAttribute('type', 'checkbox');
                    input.setAttribute('name', 'categories');
                    input.setAttribute('value', categories[i].id);
                    if (isChecked(categories[i].id)) {
                        input.setAttribute('checked', 'checked');
                    }


                    name = document.createTextNode(categories[i].name);

                    if (categories[i].host) {
                        host = document.createElement('i');
                        host.innerText = categories[i].host;
                    } else {
                        host = document.createTextNode('');
                    }


                    label = document.createElement('label');
                    label.appendChild(input);
                    label.appendChild(name);
                    label.appendChild(document.createElement('br'));
                    label.appendChild(host);

                    categoriesList.appendChild(label);
                }


                letterContainer.appendChild(letter);
                letterContainer.appendChild(categoriesList);

                return letterContainer;
            }

            // first create alphabet
            alphabet.push('#');
            for (var i = 65; i < 91; i ++) {
                alphabet.push(String.fromCharCode(i));
            }
            // then go through it and create DOM
            alphabet.forEach(function (char) {
                var slicedCategories = sliceCategories(char, categories),
                    slicedUserCategories = sliceCategories(char, userCategories);

                if (slicedCategories.length > 0) {
                    categoriesNavigationEl = createCategoriesNavigationElement(char);
                    letterContainer = createLetterContainer(char, slicedCategories, slicedUserCategories);

                    categoriesNavigation.appendChild(categoriesNavigationEl);
                    letterContainers.appendChild(letterContainer);
                }
            });


            containerBody.appendChild(topControlsContainer);
            containerBody.appendChild(letterContainers);

            container.innerHTML = '';
            container.appendChild(containerBody);


            forEach.call(container.querySelectorAll('button[name="save"]'), function (button) {
                button.addEventListener('click', function (e) {
                    var ids = [];
                    forEach.call(container.querySelectorAll('input[name="categories"]:checked'), function (input) {
                        ids.push(input.value);
                    });


                    messageView.show(MessageView.status.INFO, 'Saved');
                    userCueCategoryService.put(user.token, ids, function (err) {
                        if (err) {
                            messageView.show(MessageView.status.ERROR, err);
                        }
                    });
                });
            });
        }


        this.render = function () {
            categoriesView.renderLoader();


            var _categories,
                _userCategories;

            function caller() {
                if (typeof _categories != 'undefined' && typeof _userCategories != 'undefined') {
                    render(_categories, _userCategories);
                }
            }

            cueCategoryService.get(function (err, categories) {
                if (err) {
                    messageView.show('error', err);
                } else {
                    _categories = categories;
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

    CategoriesView.prototype = Object.create(View.prototype);
    CategoriesView.prototype.constructor = CategoriesView;

    return CategoriesView;
});
