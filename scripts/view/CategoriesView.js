'use strict';

define([
    'scripts/view/View',
    'scripts/view/Message',
    'scripts/view/Badge'
], function (View, Message, Badge) {
    function CategoriesView(container, messageView, user, userCueService, cueCategoryService, userCueCategoryService) {
        if (!(this instanceof CategoriesView)) {
            throw new Error('`this` must be an instance of view.CategoriesView');
        }

        View.call(this, container);

        var categoriesView = this,
            badge = new Badge(userCueService);

        // @TODO: whn the page is scrolled down and user click "Show only selected" checkbox navigation panel disappears

        window.addEventListener('scroll', function () {
            var topControlsContainer = document.getElementById('top-controls-container'),
                scrollTop = document.getElementById('logo').offsetHeight
                    + document.getElementById('menu').offsetHeight;

            if (!topControlsContainer) {
                return;
            }

            if (document.body.scrollTop >= scrollTop) {
                topControlsContainer.setAttribute('class', 'letter-container clear top-controls-container-fixed');
            } else {
                topControlsContainer.setAttribute('class', 'letter-container clear ');
            }
        });


        /**
         * Return categories which belong to the given letter
         *
         * @param {String} letter
         * @param {domain.CueCategory[]} categories
         * @returns {Array}
         */
        function sliceCategoriesStartOnChar(letter, categories) {
            var sliced = [];

            function equals(searchable, given) {
                if ('#' === searchable) {
                    var re = /[^a-z]/i;
                    return re.test(given);
                } else {
                    return given.toUpperCase() === searchable;
                }
            }

            for (var i = 0, j = 0; i < categories.length; i++) {
                if (equals(letter, categories[i].name[0])) {
                    sliced[j] = categories[i];
                    j++;
                }
            }

            return sliced;
        }

        function createCategoriesNavigationElement(char) {
            var span = document.createElement('span');
            span.dataset.id = 'abc-' + char;
            span.innerText = char;

            var li = document.createElement('li');
            li.appendChild(span);

            return li;
        }

        /**
         * @param {String} char
         * @param {Array} categories
         * @param {Array} userCategories
         * @param {Boolean} checkedFilter
         * @returns {HTMLElement} only if it contains categories otherwise NULL
         */
        function createLetterContainer(char, categories, userCategories, checkedFilter) {
            var label, input, name, host;

            function isChecked(id) {
                for (var i = 0; i < userCategories.length; i++) {
                    if (userCategories[i].id === id) {
                        return true;
                    }
                }

                return false;
            }

            function createInput(category) {
                var el = document.createElement('input');
                el.setAttribute('type', 'checkbox');
                el.setAttribute('name', 'categories');
                el.setAttribute('value', category.id);
                if (isChecked(category.id)) {
                    el.setAttribute('checked', 'checked');
                }

                return el;
            }

            function createName(category) {
                return document.createTextNode(category.name);
            }

            function createHost(category) {
                var el = document.createElement('i');
                if (category.host) {
                    el.innerText = category.host;
                } else {
                    el.innerHTML = '&nbsp;';
                }

                return el;
            }

            function createLabel(input, name, host) {
                label = document.createElement('label');
                label.appendChild(input);
                label.appendChild(name);
                label.appendChild(document.createElement('br'));
                label.appendChild(host);

                return label;
            }

            var letterContainer = document.createElement('div');
            letterContainer.setAttribute('class', 'letter-container');
            letterContainer.setAttribute('id', 'abc-' + char);

            var letter = document.createElement('div');
            letter.setAttribute('class', char);
            letter.innerText = char;

            var categoriesList = document.createElement('div');
            categoriesList.setAttribute('class', 'categories-list');

            for (var i = 0; i < categories.length; i++) {
                if (checkedFilter && !isChecked(categories[i].id)) {
                    continue;
                }

                input = createInput(categories[i]);
                name = createName(categories[i]);
                host = createHost(categories[i]);
                label = createLabel(input, name, host);

                categoriesList.appendChild(label);
            }


            letterContainer.appendChild(letter);
            letterContainer.appendChild(categoriesList);


            // return DOM element only if it contains categories
            return categoriesList.getElementsByTagName('label').length > 0 ? letterContainer : null;
        }


        function render(categories, userCategories, checkedFilter) {
            var containerBody = document.createDocumentFragment(),
                topControlsContainer,
                topControlsContainerRow,
                topControlsContainerWrapper,
                alphabet = [],
                categoriesNavigation,
                categoriesNavigationEl,
                letterContainers = document.createDocumentFragment(),
                letterContainer,
                button,
                checkedFilterContainer,
                checkedFilterInput;


            button = document.createElement('button');
            button.setAttribute('name', 'save');
            button.innerText = 'Save';

            categoriesNavigation = document.createElement('ul');
            categoriesNavigation.setAttribute('id', 'categories-navigation');

            topControlsContainerRow = document.createElement('div');
            topControlsContainerRow.setAttribute('class', 'clear');
            topControlsContainerRow.appendChild(button);
            topControlsContainerRow.appendChild(categoriesNavigation);

            checkedFilterInput = document.createElement('input');
            checkedFilterInput.setAttribute('type', 'checkbox');
            checkedFilterInput.setAttribute('name', 'checked-filter');
            if (checkedFilter) {
                checkedFilterInput.setAttribute('checked', 'checked');
            }


            checkedFilterContainer = document.createElement('label');
            checkedFilterContainer.setAttribute('id', 'checked-filter-container');
            checkedFilterContainer.appendChild(checkedFilterInput);
            checkedFilterContainer.appendChild(document.createTextNode('Show only selected'));

            topControlsContainer = document.createElement('div');
            topControlsContainer.setAttribute('id', 'top-controls-container');
            topControlsContainer.setAttribute('class', 'letter-container clear');
            topControlsContainer.appendChild(topControlsContainerRow);
            topControlsContainer.appendChild(checkedFilterContainer);

            topControlsContainerWrapper = document.createElement('div');
            topControlsContainerWrapper.setAttribute('id', 'top-controls-container-wrapper');
            topControlsContainerWrapper.appendChild(topControlsContainer);


            // first create alphabet
            alphabet.push('#');
            for (var i = 65; i < 91; i++) {
                alphabet.push(String.fromCharCode(i));
            }
            // then go through it and create DOM
            alphabet.forEach(function (char) {
                var slicedCategories = sliceCategoriesStartOnChar(char, categories),
                    slicedUserCategories = sliceCategoriesStartOnChar(char, userCategories);

                if (slicedCategories.length > 0) {
                    categoriesNavigationEl = createCategoriesNavigationElement(char);
                    letterContainer = createLetterContainer(char, slicedCategories, slicedUserCategories, checkedFilter);

                    if (letterContainer) {
                        categoriesNavigation.appendChild(categoriesNavigationEl);
                        letterContainers.appendChild(letterContainer);
                    }
                }
            });


            containerBody.appendChild(topControlsContainerWrapper);
            containerBody.appendChild(letterContainers);

            container.innerHTML = '';
            container.appendChild(containerBody);


            listenToSave(categories, userCategories);
            listenToCategoriesNavigation();
            listenToCategoryTick(categories, userCategories);
            listenToCheckedFilter(categories, userCategories);
        }

        function listenToSave(categories, userCategories) {
            var forEach = Array.prototype.forEach;

            forEach.call(container.querySelectorAll('button[name="save"]'), function (button) {
                button.addEventListener('click', function (e) {
                    var ids = [];
                    forEach.call(container.querySelectorAll('input[name="categories"]:checked'), function (input) {
                        ids.push(input.value);
                    });


                    messageView.show(Message.status.INFO, 'Saved');
                    userCueCategoryService.put(user.token, ids, function (err) {
                        if (err) {
                            messageView.show(Message.status.ERROR, err);
                        } else {
                            badge.render(user);


                            // if we are in "show only selected" mode. In this case I want to "commit" changes
                            // and in order to do that let's re-render the page content
                            var filter = document.getElementsByName('checked-filter')[0];
                            if (filter.checked) {
                                render(categories, userCategories, true);
                            }
                        }
                    });
                });
            });
        }

        function listenToCategoriesNavigation() {
            var forEach = Array.prototype.forEach,
                navigationOffset = document.getElementById('menu').offsetHeight
                    + document.getElementById('top-controls-container').offsetHeight;

            forEach.call(document.getElementById('categories-navigation').querySelectorAll('span'), function (el) {
                el.addEventListener('click', function (e) {
                    var offset = document.getElementById(el.dataset.id).offsetTop - navigationOffset;
                    window.scrollTo(0, offset);
                });
            });
        }

        function listenToCategoryTick(categories, userCategories) {
            var forEach = Array.prototype.forEach;

            forEach.call(container.querySelectorAll('input[name="categories"]'), function (el) {
                el.addEventListener('change', function (e) {
                    var id = el.value;
                    var i;
                    if (el.checked) {
                        for (i = 0; i < categories.length; i++) {
                            if (categories[i].id === id) {
                                userCategories.push(categories[i]);
                                break;
                            }
                        }
                    } else {
                        for (i = 0; i < userCategories.length; i++) {
                            if (userCategories[i].id === id) {
                                userCategories.splice(i, 1);
                                break;
                            }
                        }
                    }
                });
            });
        }

        function listenToCheckedFilter(categories, userCategories) {
            var filter = document.getElementsByName('checked-filter')[0];
            filter.addEventListener('change', function (e) {
                if (this.checked) {
                    render(categories, userCategories, true);
                } else {
                    render(categories, userCategories, false);
                }
            });
        }


        this.render = function () {
            categoriesView.renderLoader();


            var _categories,
                _userCategories;

            function caller() {
                if (typeof _categories != 'undefined' && typeof _userCategories != 'undefined') {
                    render(_categories, _userCategories, false);
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
