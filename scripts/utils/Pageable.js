'use strict';

define(function () {
    function Pageable(number, totalElements, totalPages, size) {
        if (! (this instanceof Pageable)) {
            throw new Error('`this` must be an instance of utils.Pageable');
        }

        this.number = number;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.size = size || 10;
    }

    return Pageable;
});
