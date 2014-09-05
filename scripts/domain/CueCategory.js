'use strict';

define(function () {
    function CueCategory(id, name, host, link) {
        if (! (this instanceof CueCategory)) {
            throw new Error('`this` must be an instance of domain.CueCategory');
        }

        this.id = id;
        this.name = name;
        this.host = host;
        this.link = link;
    }

    return CueCategory;
});
