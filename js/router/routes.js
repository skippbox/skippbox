/**
 * Created by madang on 02/09/15.
 */

kuiApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when("/", { templateUrl: "views/list.html",
            controller: "kuiListController" });
}]);