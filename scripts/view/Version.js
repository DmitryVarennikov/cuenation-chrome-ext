'use strict';

define(function () {
    function Version() {
        if (!(this instanceof Version)) {
            throw new Error('`this` must be an instance of view.Version');
        }

        function getVersion(callback) {
            var req = new XMLHttpRequest();
            req.open("GET", chrome.runtime.getURL('manifest.json'), true);
            req.onreadystatechange = function () {
                if (4 === req.readyState) {
                    if (200 === req.status) {
                        var json = JSON.parse(req.responseText);

                        callback(json.version);
                    }
                }
            }
            req.send();
        }

        getVersion(function (version) {
            var container = document.getElementById('version');
            container.innerText = version;
        });
    }

    return Version;
});
