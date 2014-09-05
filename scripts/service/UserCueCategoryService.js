'use strict';

define(['scripts/config', 'scripts/domain/CueCategory'], function (config, CueCategory) {
    function UserCueCategoryService() {
        if (! (this instanceof UserCueCategoryService)) {
            throw new Error('`this` must be an instance of service.UserCueCategoryService');
        }

        var userCueCategoryService = this;
        var baseUrl = config['api-server-url'];

        /**
         * @param {String} token
         * @param {Function} callback({Error}, {domain.CueCategory[]})
         */
        this.get = function (token, callback) {
            var req = new XMLHttpRequest();
            req.open('GET', baseUrl + '/user-tokens/' + token + '/cue-categories', true);
            req.onreadystatechange = function () {
                if (4 === req.readyState) {
                    if (200 === req.status) {
                        var response = JSON.parse(req.response);
                        var cueCategories = [];

                        var cueCategoriesData = response._embedded && response._embedded.userCueCategories || [];
                        for (var i = 0; i < cueCategoriesData.length; i ++) {
                            cueCategories[i] = new CueCategory(
                                cueCategoriesData[i].id,
                                cueCategoriesData[i].name,
                                cueCategoriesData[i].host,
                                cueCategoriesData[i].link);
                        }

                        callback(null, cueCategories);
                    } else {
                        callback(Error(req.statusText));
                    }
                }
            }
            req.send(null);
        }

        /**
         * @param {String} token
         * @param {String[]} ids
         * @param {Function} callback({Error})
         */
        this.put = function (token, ids, callback) {
            var req = new XMLHttpRequest();
            req.open('PUT', baseUrl + '/user-tokens/' + token + '/cue-categories', true);
            req.onreadystatechange = function () {
                if (4 === req.readyState) {
                    if (200 === req.status) {
                        callback(null);
                    } else {
                        callback(Error(req.statusText));
                    }
                }
            }
            req.setRequestHeader('Content-Type', 'application/json');
            req.send(JSON.stringify({ids: ids}));
        };
    }

    return UserCueCategoryService;
});
