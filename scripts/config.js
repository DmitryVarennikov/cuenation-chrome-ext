'use strict';

var conf = {
    "dev":  {
        "api-server-url": "http://localhost:8080"
    },
    "prod": {
        "api-server-url": "http://162.243.254.55:8080"
    }
};


define(['scripts/utils/mode'], function (mode) {
    return conf[mode];
});
