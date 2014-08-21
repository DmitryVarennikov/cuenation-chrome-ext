'use strict';

define(['scripts/config', 'scripts/domain/CueCategory'], function (config, CueCategory) {
    function CueCategoryService() {
        if (! (this instanceof CueCategoryService)) {
            throw new Error('`this` must be an instance of service.CueCategoryService');
        }

        var cueCategoryService = this;
        var baseUrl = config['api-server-url'];

        /**
         * @param {Function} callback({Error}, {domain.CueCategory[]}, {Pageable})
         */
        this.get = function (callback) {
            var req = new XMLHttpRequest();
            req.open('GET', baseUrl + '/cue-categories', true);
            req.onreadystatechange = function () {
                if (4 === req.readyState) {
                    if (200 === req.status) {
                        var response = JSON.parse(req.response);
                        var cueCategories = [];

                        var cueCategoriesData = response._embedded && response._embedded.cueCategories || [];
                        for (var i = 0; i < cueCategoriesData.length; i ++) {
                            cueCategories[i] = new CueCategory(cueCategoriesData[i].id,
                                cueCategoriesData[i].name, cueCategoriesData[i].link);
                        }

                        callback(null, cueCategories);
                    } else {
                        callback(Error(req.statusText));
                    }
                }
            }
            req.send(null);
        }
    }

    return CueCategoryService;
});
