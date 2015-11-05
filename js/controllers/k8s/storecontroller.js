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

kuiApp.controller("storeController", function ( $scope, appstore, NgTableParams) {
  var self = this;

  appstore.getCommits( function (e, sha) {
        if (!e)
        {
            $scope.newsha = sha;
            appstore.getTree( sha, function (e, tree) {
              if (!e)
                {
                  $scope.tree = tree.tree;
                  self.tableParams = new NgTableParams({count: 5}, {counts: [5, 10, 25], data: $scope.tree});

                  $scope.$apply();
                 }
              else
                  console.log( 'error' + JSON.stringify(e));
            });
        }
        else
            console.log( 'error' + JSON.stringify(e));
    });

  $scope.browse = function ( sha ) {
    appstore.getTree( sha, function (e, tree) {
      if (!e)
          {
            $scope.subtree = tree;
            $scope.$apply();
          }
      else
          console.log( 'error' + JSON.stringify(e));
    })
  }

});
