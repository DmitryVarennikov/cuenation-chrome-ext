'use strict';

define(['scripts/config', 'scripts/domain/User'], function (config, User) {
    function UserService() {
        if (! (this instanceof UserService)) {
            throw new Error('`this` must be an instance of service.UserService');
        }

        var userService = this;
        var baseUrl = config['api-server-url'];

        /**
         * @param {Function} callback({Error}, {domain.User})
         */
        this.post = function (callback) {
            var req = new XMLHttpRequest();
            req.open('POST', baseUrl + '/user-tokens', true);
            req.onreadystatechange = function () {
                if (4 === req.readyState) {
                    if (201 === req.status) {
                        var url = req.getResponseHeader('Location');
                        var re = /([a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12})/;
                        if (null === url.match(re)) {
                            callback(Error("Can not find user token in the URL: " + url));
                        } else {
                            var token = url.match(re)[0];
                            userService.get(token, callback);
                        }
                    } else {
                        callback(Error(req.statusText));
                    }
                }
            };
            req.send(null);
        }

        /**
         * @param {String} token
         * @param {Function} callback({Error}, {domain.User})
         */
        this.get = function (token, callback) {
            var req = new XMLHttpRequest();
            req.open('GET', baseUrl + '/user-tokens/' + token, true);
            req.onreadystatechange = function () {
                if (4 === req.readyState) {
                    if (200 === req.status) {
                        var response = JSON.parse(req.response);
                        var user = new User(response.token);
                        callback(null, user);
                    } else {
                        callback(Error(req.statusText));
                    }
                }
            }
            req.send(null);
        }

        /**
         * @param {Object} storage - chrome.storage.sync (see https://developer.chrome.com/extensions/storage)
         * @param {Function} callback({Error}, {domain.User})
         */
        this.init = function (storage, callback) {
            var user;

            storage.get('token', function (obj) {
                if (obj.token) {
                    user = new User(obj.token);
                    callback(null, user);
                } else {
                    userService.post(function (err, user) {
                        if (err) {
                            callback(err);
                        } else {
                            storage.set({"token": user.token}, function () {
                                callback(null, user);
                            });
                        }
                    });
                }
            });
        }
    }

    return UserService;
});

