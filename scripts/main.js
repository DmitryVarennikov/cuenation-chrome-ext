'use strict';

require.config({
    baseUrl: '../',
    urlArgs: 'bust=' + (new Date()).getTime()
});

require([
    'scripts/domain/User',
    'scripts/core/Router',
    'scripts/view/TopNavigation',
    'scripts/view/Message',
    'scripts/view/CuesView',
    'scripts/view/CategoriesView',
    'scripts/service/UserCueService',
    'scripts/service/CueCategoryService',
    'scripts/service/UserCueCategoryService'
],
    function (User, Router, TopNavigation, MessageView, CuesView, CategoriesView, UserCueService, CueCategoryService, UserCueCategoryService) {
        var token = "8c9f8cf4-1689-48ab-bf53-ee071a377f60",
            user = new User(token),
            messageView = new MessageView(),
            container = document.getElementById('page-content'),
            userCueService = new UserCueService(),
            cueCategoryService = new CueCategoryService(),
            userCueCategoryService = new UserCueCategoryService();


        var cuesView = new CuesView(container, messageView, user, userCueService);
        var categoriesView = new CategoriesView(container, messageView, user, cueCategoryService, userCueCategoryService);
        var router = new Router(cuesView, categoriesView);
        new TopNavigation(router);

        // manually click first page
//        document.querySelector('#menu li:nth-child(2) a').click();
        document.querySelector('#menu .landing').click();


//    var userService = new UserService();
//    userService.get("8c9f8cf4-1689-48ab-bf53-ee071a377f60", function (err, user) {
//        console.log(err, user);
//    });

//    userService.post(function (err, user) {
//        console.log(err, user);
//    });


    });
