'use strict';

require.config({
    baseUrl: '..',
    paths:   {
        "google-analytics": [
            'https://ssl.google-analytics.com/ga'
        ]
    }
});

require([
        'scripts/utils/GA',
        'scripts/domain/User',
        'scripts/core/Router',
        'scripts/view/Version',
        'scripts/view/TopNavigation',
        'scripts/view/Message',
        'scripts/view/CuesView',
        'scripts/view/CategoriesView',
        'scripts/service/UserService',
        'scripts/service/UserCueService',
        'scripts/service/CueCategoryService',
        'scripts/service/UserCueCategoryService'
    ],
    function (GA, User, Router, Version, TopNavigation, MessageView, CuesView, CategoriesView, UserService, UserCueService, CueCategoryService, UserCueCategoryService) {
        function start(err, user) {
            var ga = GA.getInstance();
            ga.trackPageview();


            var versionView = new Version(),
                messageView = new MessageView(),
                userCueService = new UserCueService(),
                cueCategoryService = new CueCategoryService(),
                userCueCategoryService = new UserCueCategoryService(),
                container = document.getElementsByClassName('page-content').item(0);


            var cuesView = new CuesView(container, messageView, user, userCueService, userCueCategoryService),
                categoriesView = new CategoriesView(container, messageView, user, userCueService, cueCategoryService, userCueCategoryService),
                router = new Router(cuesView, categoriesView),
                nav = new TopNavigation(router, ga);


            if (err) {
                messageView.show('error', err);
            } else {
                // manually click first page
                document.querySelector('#menu .landing').click();
            }
        }


        // "8c9f8cf4-1689-48ab-bf53-ee071a377f60"
        var userService = new UserService();
        userService.init(chrome.storage.sync, start);
    });
