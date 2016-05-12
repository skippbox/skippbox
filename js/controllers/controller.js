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

kuiApp.controller("kuiController", function ($rootScope, $scope, $location, $route, $filter, config, contextService) {

    $scope.headerSrc = "views/header.html";
    $scope.contexts = config.Contexts;
    $scope.clusters = config.Clusters;
    $scope.users = config.Users;

    if ($scope.contexts) {
        $scope.selected_context = $scope.contexts[0].name;
        contextService.setSelectedURL($scope.contexts[0]);
    }

    var gui = require('nw.gui');
    win = gui.Window.get();
    if (process.platform === "darwin") {
        var mb = new gui.Menu({type: 'menubar'});
        mb.createMacBuiltin('RoboPaint', {
            hideEdit: false
        });
        gui.Window.get().menu = mb;
        win.on('minimize', function() {
        });
        win.on('hide', function() {
        });
        $( ".fullscreen-button" ).click(function() {
         var $this = $(".fullscreen-button");
         if ($this.hasClass("fullscreen-expand")) {
             $this.removeClass("fullscreen-expand").addClass("fullscreen-compress");
             return;
         }
         if ($this.hasClass("fullscreen-compress")) {
             $this.removeClass("fullscreen-compress").addClass("fullscreen-expand");
             return;
         }
        });
    }

    $scope.changeContext = function (context) {
        selectedContext = $filter('filter')($scope.contexts, {name: context})[0];
        contextService.setSelectedURL(selectedContext);
        $scope.refresh();
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

kuiApp.controller("contextController", function ($scope, $location, config, NgTableParams) {

    this.contexts = config.Contexts;
    this.openIndex = -1;
    this.tableParams = new NgTableParams({count: 5}, {counts: [5, 10, 25], data: $scope.contexts});
    $scope.clusters = config.Clusters;
    $scope.users = config.Users;
    this.toggleJsonCell = function (index) {
      this.openIndex = index === this.openIndex ? -1 : index;
    };
});
