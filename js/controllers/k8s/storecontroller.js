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

kuiApp.controller("storeController", function ( $scope, $filter, k8s, appstore, contextService, ngTableParams) {
  var self = this;
  $scope.yaml = [];
  $scope.isRC = false;
  $scope.user = "skippbox";
  $scope.repo = "appstore";

  var rowClicked = false;
  $scope.onRowClick = function (node) {
    if (rowClicked) { return; }
    $scope.isRC = false;
    var patt = /.yaml|.yml|.json/g;
    rowClicked = true;
    setTimeout(function () {
      rowClicked = false;
    }, 300);
    if (node.children && node.children.length > 0) {
      node.expanded = !node.expanded;
    }
    if (node.type === 'blob' && patt.test(node.name)){
      $scope.showYamlSpiner = true;
      appstore.getBlob( $scope.user, $scope.repo, node.sha, function (e, blob) {
        $scope.showYamlSpiner = false;
        if (!e)
        {
          var yamllib = require('js-yaml');
          $scope.yaml = {
            content: yamllib.load(atob(blob.content)),
            title: node.path
          };
          if ($scope.yaml.content.kind === "ReplicationController") $scope.isRC=true;
          $scope.$apply();
        }
        else
        {
          console.log('Error: ' + e);
        }
      });
    } else {
      $scope.yaml = {};
    }
  }

  $scope.getTree = function ( user, repo ) {
    $scope.user = user;
    $scope.repo = repo;
    $scope.hideSpiner=false;
    appstore.getCommits( user, repo, function (e, sha, url) {
      if (!e)
      {
        console.log("La sha es: "+ sha)
        $scope.appstoreUrl = url[0].url.replace(/\/commits\/.+/g, "").replace(/\/repos/g, "");
        appstore.getTree( user, repo, sha, function (e, tree) {
          if (!e)
            {
              $scope.tree = tree.tree;
              $scope.getTreeView($scope.tree, function (tree){
                $scope.nestedTree = tree;
                console.log(tree);
                $scope.$apply();
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
  };

  $scope.getTree($scope.user, $scope.repo);

  $scope.getTreeView = function ( pathTree, callback ) {
    var tree = [];
    $scope.yaml = [];

    angular.forEach(pathTree, function (file, key) {
      var currentLevel = tree;
      var path = file.path;
      var pathParts = path.split('/');

      angular.forEach(pathParts, function (part, key) {

        var existingPath;

        //faster
        for (var i = 0; i < currentLevel.length; i++) {
          if(currentLevel[i].name === part){
            existingPath = currentLevel[i];
            break;
          }
        }

        //slower
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

  $scope.createRc = function (newrc) {
    contextService.getConnection().replicationControllers.create(newrc, function (err, p1) {
        if (err) {
            console.log('error creating rc: ' + JSON.stringify(err));
            alert(JSON.stringify(err.message.message));
        }else{
          console.log('funciona');
        }
    });
  }

  $scope.getNewStore = function (url) {
    var values = url.replace(/.+github\.com\/|\/git\/.+/g, "").split("/");
    console.log(JSON.stringify(values));
    $scope.getTree(values[0], values[1]);
  }

});
