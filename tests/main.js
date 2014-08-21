'use strict';

require.config({
    baseUrl: '../',
    urlArgs: 'bust=' + (new Date()).getTime()
});

require(['tests/mocha'], function () {
    // mocha is global
    mocha.setup('bdd');
    mocha.checkLeaks();

    require([
        'tests/test.utils',
        'tests/test.domain',
        'tests/test.services'
    ],
        function () {
            mocha.run();
        });

});
