'use strict';

define(function (require) {

    var chai = require('tests/chai');
    var User = require('scripts/domain/User'),
        Cue = require('scripts/domain/Cue'),
        CueCategory = require('scripts/domain/CueCategory');

    describe('domain', function () {
        describe('User', function () {
            it('correct object', function () {
                var user = new User('8c9f8cf4-1689-48ab-bf53-ee071a377f60');

                chai.assert.equal(user.token, '8c9f8cf4-1689-48ab-bf53-ee071a377f60');
            });
        });
        describe('Cue', function () {
            it('correct object', function () {
                var id = '53ef0f3844ae8cebf6152396',
                    title = 'Bryan Kearney - KEARNAGE 060 (2014-08-05)',
                    link = 'http://cuenation.com?page=tracklist&folder=kearnage&filename=Bryan+Kearney+-+KEARNAGE+060.cue',
                    createdAt = 1407353640;

                var cue = new Cue(id, title, link, createdAt);

                chai.assert.equal(cue.id, id);
                chai.assert.equal(cue.title, title);
                chai.assert.equal(cue.link, link);
                chai.assert.instanceOf(cue.createdAt, Date);
                // yes, in milliseconds
                chai.assert.equal(cue.createdAt.getTime(), createdAt * 1000);
            });
        });
        describe('CueCategory', function () {
            it('correct object', function () {
                var id = '53e5bc5b837125a9f6149e4b',
                    name = '#goldrushRADIO',
                    host = 'with Ben Gold',
                    link = 'http://cuenation.com/?page=cues&folder=goldrushradio';

                var cueCategory = new CueCategory(id, name, host, link);

                chai.assert.equal(cueCategory.id, id);
                chai.assert.equal(cueCategory.name, name);
                chai.assert.equal(cueCategory.host, host);
                chai.assert.equal(cueCategory.link, link);
            });
        });
    });

});
