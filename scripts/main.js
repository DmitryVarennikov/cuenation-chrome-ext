'use strict';

require.config({
    baseUrl: '../'
});

require([
    'scripts/domain/User',
    'scripts/core/Router',
    'scripts/view/TopNavigation',
    'scripts/view/Message',
    'scripts/view/CuesView',
    'scripts/view/CategoriesView',
    'scripts/service/UserService',
    'scripts/service/UserCueService',
    'scripts/service/CueCategoryService',
    'scripts/service/UserCueCategoryService'
],
    function (User, Router, TopNavigation, MessageView, CuesView, CategoriesView, UserService, UserCueService, CueCategoryService, UserCueCategoryService) {
        function start(err, user) {
            var messageView = new MessageView(),
                userCueService = new UserCueService(),
                cueCategoryService = new CueCategoryService(),
                userCueCategoryService = new UserCueCategoryService(),
                container = document.getElementsByClassName('page-content').item(0);


            var cuesView = new CuesView(container, messageView, user, userCueService, userCueCategoryService),
                categoriesView = new CategoriesView(container, messageView, user, cueCategoryService, userCueCategoryService),
                router = new Router(cuesView, categoriesView),
                nav = new TopNavigation(router);


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
