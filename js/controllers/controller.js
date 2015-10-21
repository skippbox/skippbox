/*
 Copyright 2015 Skippbox, Ltd

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

kuiApp.controller("kuiController", function ($rootScope, $scope, $location, $route, config, contextService) {

    $scope.headerSrc = "views/header.html";

    $scope.contexts = config.Contexts;
    $scope.clusters = config.Clusters;
    $scope.users = config.Users;

    if ($scope.contexts) {
        $scope.selected_context = $scope.contexts[0].name;
        contextService.setSelectedURL($scope.contexts[0]);
    }

    var gui = require('nw.gui');
    if (process.platform === "darwin") {
        var mb = new gui.Menu({type: 'menubar'});
        mb.createMacBuiltin('RoboPaint', {
            hideEdit: false
        });
        gui.Window.get().menu = mb;
    }

    $scope.changeContext = function (context) {
        contextService.setSelectedURL(context);
    }

    $scope.back = function () {
        window.history.back();
    };

    $scope.isActive = function (route) {
        return route === $location.path();
    }

    $scope.isActivePath = function (route) {
        return ($location.path()).indexOf(route) >= 0;
    }

    $scope.refresh = function () {
        $route.reload();
    }

    $scope.searchString = function(txt) {
        $rootScope.searchText = txt;
        $rootScope.$broadcast('searchTag', txt);
    }

});

kuiApp.controller("contextController", function ($scope, $location, config) {

    $scope.contexts = config.Contexts;
    $scope.clusters = config.Clusters;
    $scope.users = config.Users;

});