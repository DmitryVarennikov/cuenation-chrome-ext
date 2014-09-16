'use strict';

define(function () {
    function Badge(userCueService) {
        if (! (this instanceof Badge)) {
            throw new Error('`this` must be an instance of view.Badge');
        }

        this.render = function (user) {
            userCueService.get(user.token, 0, function (err, cues, pageable) {
                var text;
                if (err) {
                    text = 'err';
                } else {
                    text = (new String(pageable.totalElements)).toString();
                }

                chrome.browserAction.setBadgeText({text: text});
                chrome.browserAction.setBadgeBackgroundColor({color: "#807A60"});
            });
        }
    }

    return Badge;
});
