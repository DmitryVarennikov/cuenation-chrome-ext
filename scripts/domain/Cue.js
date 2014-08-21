'use strict';

define(function () {
    function Cue(id, title, link, createdAt) {
        if (! (this instanceof Cue)) {
            throw new Error('`this` must be an instance of domain.Cue');
        }

        this.id = id;
        this.title = title;
        this.link = link;
        this.createdAt = new Date(createdAt * 1000);
    }

    return Cue;
});
