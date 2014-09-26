'use strict';

define(['scripts/config', 'scripts/domain/CueCategory'], function (config, CueCategory) {
    function CueCategoryService() {
        if (!(this instanceof CueCategoryService)) {
            throw new Error('`this` must be an instance of service.CueCategoryService');
        }

        var cueCategoryService = this;
        var baseUrl = config['api-server-url'];

        /**
         * @param {Function} callback({Error}, {domain.CueCategory[]})
         */
        this.get = function (callback) {
            var storage = chrome.storage.local;

            storage.get('cue-categories-e-tag', function (obj) {
                var eTag = '';
                if (obj['cue-categories-e-tag']) {
                    eTag = obj['cue-categories-e-tag'];
                }

                get(eTag, function (err, cueCategories, eTag) {
                    if (err) {
                        callback(err);
                        // categories changes, let's re-cache them along with the new ETag
                    } else if (cueCategories.length) {
                        if (eTag) {
                            setCache(cueCategories, eTag, function () {
                                callback(null, cueCategories);
                            });
                        } else {
                            console.error('ETag was not set');
                            callback(null, cueCategories);
                        }
                    } else {
                        // if categories didn't come then they didn't change, let's fetch them from cache
                        storage.get('cue-categories', function (obj) {
                            if (obj['cue-categories']) {
                                callback(null, obj['cue-categories']);
                            } else {
                                // though if for some reason they don't exist in our cache let's fetch them from the server
                                get('', function (err, cueCategories) {
                                    if (err) {
                                        callback(err);
                                    } else {
                                        setCache(cueCategories, eTag, function () {
                                            callback(null, cueCategories);
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            });


            function setCache(cueCategories, eTag, callback) {
                storage.set({'cue-categories-e-tag': eTag}, function () {
                    storage.set({'cue-categories': cueCategories}, function () {
                        callback();
                    });
                });
            }

            /**
             * @param {String} ifNonMatch
             * @param {Function} callback({Error}, {domain.CueCategory[]}, {String})
             */
            function get(ifNonMatch, callback) {
                var req = new XMLHttpRequest();
                req.open('GET', baseUrl + '/cue-categories', true);
                req.setRequestHeader('If-None-Match', ifNonMatch);
                req.onreadystatechange = function () {
                    if (4 === req.readyState) {
                        var cueCategories = [],
                            eTag = null;

                        if (200 === req.status) {
                            eTag = req.getResponseHeader('ETag');

                            var response = JSON.parse(req.response);
                            var cueCategoriesData = response._embedded && response._embedded.cueCategories || [];
                            for (var i = 0; i < cueCategoriesData.length; i++) {
                                cueCategories[i] = new CueCategory(
                                    cueCategoriesData[i].id,
                                    cueCategoriesData[i].name,
                                    cueCategoriesData[i].host,
                                    cueCategoriesData[i].link);
                            }

                            callback(null, cueCategories, eTag);
                        } else if (304 === req.status) {
                            callback(null, cueCategories, eTag);
                        } else {
                            callback(Error(req.statusText));
                        }
                    }
                };
                req.send(null);
            }
        }
    }

    return CueCategoryService;
});
