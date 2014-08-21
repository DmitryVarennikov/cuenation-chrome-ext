'use strict';

define(function () {
    function CueCategory(id, name, link) {
        if (! (this instanceof CueCategory)) {
            throw new Error('`this` must be an instance of domain.CueCategory');
        }

        this.id = id;
        this.name = name;
        this.link = link;
    }

    return CueCategory;
});
