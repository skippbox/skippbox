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

kuiApp.controller("deployController", function ( $scope, $filter, appstore, ngTableParams) {
  var self = this;

  $scope.onChildrenClick = function (node) {
    var patt = new RegExp(".yaml");
    if (node.type === 'blob' && patt.test(node.name)){
      appstore.getBlob( node.sha, function (e, blob) {
        if (!e)
        {
          var yamllib = require('js-yaml');          
          $scope.yaml = yamllib.load(atob(blob.content));
          $scope.$apply();
        }
        else
        {
          console.log('Error: ' + e);
        }
      });
    }
  }

  appstore.getCommits( function (e, sha) {
      if (!e)
      {
          appstore.getTree( sha, function (e, tree) {
            if (!e)
              {
                $scope.tree = tree.tree;
                $scope.getTreeView($scope.tree, function (tree){

                  $scope.newTree = tree;
                });
                $scope.hideSpiner=true;
                $scope.$apply();
               }
            else
                console.log( 'error' + JSON.stringify(e));
          });
      }
      else 
          console.log( 'error' + JSON.stringify(e));
  });

  //if we already know the sha, we don't need the previous request

  /*var sha = '16203b4b087e40e27cf42255158e8d5c0cedba73';
    appstore.getTree( sha, function (e, tree) {
      if (!e)
        {
          $scope.tree = tree.tree;
          $scope.getTreeView($scope.tree, function (tree){

            $scope.newTree = tree;
            //$scope.$apply();
          });

          $scope.$apply();
         }

    });*/

  $scope.getTreeView = function ( pathTree, callback ) {
    var tree = [];

    angular.forEach(pathTree, function (file, key) {
      var currentLevel = tree;
      var path = file.path;
      var pathParts = path.split('/');

      angular.forEach(pathParts, function (part, key) {
        
        var existingPath;
        
        for (var i = 0; i < currentLevel.length; i++) {
          if(currentLevel[i].name === part){
            existingPath = currentLevel[i];
            break;
          }
        }
        
        /*var done = false;
        angular.forEach(currentLevel, function (elem, key) {
          if(elem.name === part && !done){
            existingPath = elem;
            done=true;
          }
        });*/

        if (existingPath) {
            currentLevel = existingPath.children;
        } else {
            var newPart = {
                name: part,
                path: file.path,
                sha: file.sha,
                type: file.type,
                children: [],
            }
            currentLevel.push(newPart);
            currentLevel = newPart.children;
        }
      });

    });
    callback(tree);
  }


});
