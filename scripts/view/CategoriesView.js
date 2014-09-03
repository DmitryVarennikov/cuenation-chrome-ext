'use strict';

define(['scripts/view/View'], function (View) {
    function CategoriesView(container, messageView, user, cueCategoryService, userCueCategoryService) {
        if (! (this instanceof CategoriesView)) {
            throw new Error('`this` must be an instance of view.CategoriesView');
        }

        View.call(this);


        function render(categories, userCategories) {
            var forEach = Array.prototype.forEach,
                containerBody = document.createDocumentFragment(),
                title,
                controlsContainer,
                alphabet = [],
                categoriesNavigation,
                categoriesNavigationEl,
                letterContainers = document.createDocumentFragment(),
                letterContainer,
                button;

            title = document.createElement('h1');
            title.setAttribute('class', 'page-title');
            title.innerText = 'Categories';


            button = document.createElement('button');
            button.setAttribute('name', 'save');
            button.innerText = 'Save';
            controlsContainer = document.createElement('div');
            controlsContainer.setAttribute('class', 'controls-container clear');
            controlsContainer.appendChild(button);


            categoriesNavigation = document.createElement('ul');
            categoriesNavigation.setAttribute('id', 'categories-navigation');
            categoriesNavigation.setAttribute('class', 'clear');

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
                var li, label, input, txtNode;

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

                var categoriesList = document.createElement('ul');
                categoriesList.setAttribute('class', 'categories-list clear');

                for (var i = 0; i < categories.length; i ++) {
                    input = document.createElement('input');
                    input.setAttribute('type', 'checkbox');
                    input.setAttribute('name', 'categories');
                    input.setAttribute('value', categories[i].id);
                    if (isChecked(categories[i].id)) {
                        input.setAttribute('checked', 'checked');
                    }


                    txtNode = document.createTextNode(categories[i].name);

                    label = document.createElement('label');
                    label.appendChild(input);
                    label.appendChild(txtNode);

                    li = document.createElement('li');
                    li.appendChild(label);

                    categoriesList.appendChild(li);
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


            containerBody.appendChild(title);
            containerBody.appendChild(controlsContainer);
            containerBody.appendChild(categoriesNavigation);
            containerBody.appendChild(letterContainers);
            containerBody.appendChild(controlsContainer.cloneNode(true));

            container.innerHTML = '';
            container.appendChild(containerBody);


            // @TODO: subscribe for "save" event
        }


        this.render = function () {
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
