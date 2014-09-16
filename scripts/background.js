'use strict';

require.config({
    baseUrl: '..'
});

require([
    'scripts/service/UserService',
    'scripts/service/UserCueService',
    'scripts/view/Badge'
],
    function (UserService, UserCueService, Badge) {
        function start(err, user) {
            var userCueService = new UserCueService(),
                badge = new Badge(userCueService);

            badge.render(user);
            // once a minute is enough
            setInterval(function (badge, user) {
                badge.render(user);
            }, 60000, badge, user);
        }

        // "8c9f8cf4-1689-48ab-bf53-ee071a377f60"
        var userService = new UserService();
        userService.init(chrome.storage.sync, start);
    });
