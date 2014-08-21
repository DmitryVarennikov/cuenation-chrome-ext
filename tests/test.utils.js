'use strict';

define(function (require) {

    var chai = require('tests/chai');
    var Pageable = require('scripts/utils/Pageable');

    describe('utils', function () {
        describe('Pageable', function () {
            it('correct object', function () {
                var pageable = new Pageable(0, 10, 5);

                chai.assert.equal(pageable.number, 0);
                chai.assert.equal(pageable.totalElements, 10);
                chai.assert.equal(pageable.totalPages, 5);
                chai.assert.equal(pageable.size, 10);
            });
        });
    });
    
});
