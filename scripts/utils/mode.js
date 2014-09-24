'use strict';

function getMode() {
    var mode;

    if (!mode) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", chrome.runtime.getURL('manifest.json'), false);
        xhr.send();

        if (xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            // Chrome Web Store adds `update_url` when you upload your extension.
            // `http://stackoverflow.com/a/12833511/407986`
            mode = 'update_url' in json ? "prod" : "dev";
        }
    }

    return mode;
}

define(function () {
    return getMode();
});

//define(function (callback) {
//    chrome.management.get(chrome.runtime.id, function (extensionInfo) {
//        var env = extensionInfo.installType === 'development' ? 'dev' : 'prod';
//
//        callback(conf[env]);
//    });
//});