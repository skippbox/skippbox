/**
 * Created by madang on 02/09/15.
 */

kuiApp.config(function ($routeProvider) {
    $routeProvider
        .when("/", { templateUrl: "views/home.html",
            controller: "kuiController"
        }).when("/pods", {
            templateUrl: "views/pods.html",
            controller: "podController"
        }).when("/services", {
            templateUrl: "views/services.html",
            controller: "servicesController"
        }).when("/rc", {
            templateUrl: "views/rc.html",
            controller: "rcController"
        }).otherwise({
            redirectTo: '/'
        });
});
