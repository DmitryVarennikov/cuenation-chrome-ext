'use strict';

define(['config', 'domain/Cue', 'utils/Pageable'], function (config, Cue, Pageable) {
    function UserCueService() {
        if (! (this instanceof UserCueService)) {
            throw new Error('`this` must be an instance of service.UserCueService');
        }

        var userCueService = this;
        var baseUrl = config['api-server-url'];

        /**
         * @param {String} token
         * @param {Number} page
         * @param {Function} callback({Error}, {domain.Cue[]})
         */
        this.get = function (token, page, callback) {
            var req = new XMLHttpRequest();
            req.open('GET', baseUrl + '/user-tokens/' + token + '/cues?page=' + page, true);
            req.onreadystatechange = function () {
                if (4 === req.readyState) {
                    if (200 === req.status) {
                        var response = JSON.parse(req.response);
                        var cues = [];

                        var cuesData = response._embedded && response._embedded.userCues || [];
                        for (var i = 0; i < cuesData.length; i ++) {
                            cues[i] = new Cue(cuesData[i].id, cuesData[i].title, cuesData[i].link,
                                cuesData[i].createdAt);
                        }

                        var pageable = new Pageable(response.page.number, response.page.totalElements,
                            response.page.totalPages, response.page.size);

                        callback(null, cues, pageable);
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
            req.open('PUT', baseUrl + '/user-tokens/' + token + '/cues', true);
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

    return UserCueService;
});
