'use strict';

define(function () {
    function User(token) {
        if (! (this instanceof User)) {
            throw new Error('`this` must be an instance of domain.User');
        }

        this.token = token;
    }

    return User;
});
