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

  $scope.lala = function () {
    //console.log(node.name);
    //console.log(node.sha);
    //appstore.getBlob( node.sha, function (e, blob) {
      if (true)
      {
        var yamllib = require('js-yaml');
        var napa = "bmFtZTogYWxwaW5lCmhvbWU6IGh0dHA6Ly93d3cuYWxwaW5lbGludXgub3Jn\\\\nLwp2ZXJzaW9uOiAwLjEuMApkZXNjcmlwdGlvbjogU2ltcGxlIHBvZCBydW5u\\\\naW5nIEFscGluZSBMaW51eC4KbWFpbnRhaW5lcnM6CiAgLSBNYXR0IEJ1dGNo\\\\nZXIgPG1idXRjaGVyQGRlaXMuY29tPgpkZXRhaWxzOgogIFRoaXMgcGFja2Fn\\\\nZSBwcm92aWRlcyBhIGJhc2ljIEFscGluZSBMaW51eCBpbWFnZSB0aGF0IGNh\\\\nbiBiZSB1c2VkIGZvciBiYXNpYwogIGRlYnVnZ2luZyBhbmQgdHJvdWJsZXNo\\\\nb290aW5nLiBCeSBkZWZhdWx0LCBpdCBzdGFydHMgdXAsIHNsZWVwcyBmb3Ig\\\\nYSBsb25nCiAgdGltZSwgYW5kIHRoZW4gZXZlbnR1YWxseSBzdG9wcy4K\\\\n\\";
        console.log(napa);
        newpod = yamllib.load(atob(napa));
        console.log(JSON.stringify(newpod));
      }
      else
      {
        console.log('nanai');
      }
    //});
  }
  $scope.lala()

  /*appstore.getCommits( function (e, sha) {
        if (!e)
        {
            $scope.newsha = sha;
            appstore.getTree( sha, function (e, tree) {
              if (!e)
                {
                  $scope.tree = tree.tree;
                  $scope.getTreeView($scope.tree, function (tree){

                    $scope.newTree = tree;
                    //$scope.$apply();
                  });

                  console.log(typeof($scope.tree));
                  self.tableParams = new ngTableParams(
                    {count: 5}, 
                    {
                      counts: [5, 10, 25], 
                      data: $scope.tree
                    }
                  );

                  $scope.$apply();
                 }
              else
                  console.log( 'error' + JSON.stringify(e));
            });
        }
        else 
            console.log( 'error' + JSON.stringify(e));
    /*});

  /*$scope.browse = function ( sha ) {
    console.log('sha: '+sha);
    appstore.getTree( sha, function (e, tree) {
      if (!e)
          {
            $scope.subtree = tree;
            $scope.$apply();
          }
      else
          console.log( 'error' + JSON.stringify(e));
    })
  }*/

  /*$scope.getTreeView = function ( pathTree, callback ) {
    //console.log('comenzamos');
    var tree = [];
    //console.log("holis");
    //console.log(JSON.stringify(tree));

    angular.forEach(pathTree, function (file, key) {
      //console.log(file);
      var path = file.path;

      var currentLevel = tree;

      var pathParts = path.split('/');
      //console.log(JSON.stringify(pathParts));

      angular.forEach(pathParts, function (part, key) {
        
        var existingPath;
        var done = false;
        angular.forEach(currentLevel, function (test, key) {
          if(test.name === part && !done){
            existingPath = test;
            done=true;
          }
        });

        if (existingPath) {
            currentLevel = existingPath.children;
        } else {
            console.log(JSON.stringify(file.sha));
            var newPart = {
                name: part,
                path: file.path,
                sha: file.sha,
                children: [],
            }
            currentLevel.push(newPart);
            currentLevel = newPart.children;
        }
      });

    });
    //console.log(JSON.stringify(tree));
    callback(tree);
  }*/

  //$scope.getTreeView();

});
