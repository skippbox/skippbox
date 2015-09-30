/**
 * Created by madang on 02/09/15.
 */

kuiApp.controller("kuiController", function ($scope, $location) {
    $scope.headerSrc = "views/header.html";

    yaml = require('js-yaml');
    fs   = require('fs');
 
    // Get document, or throw exception on error
    try {
      config = yaml.safeLoad(fs.readFileSync('/Users/sebastiengoasguen/.kube/config', 'utf8'));
      console.log(config);
    } catch (e) {
      console.log(e);
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

});


kuiApp.factory('k8s', function($resource) {
  return {
     Services: $resource('http://127.0.0.1:8080/api/v1/namespaces/default/services/:name'),
     Pods: $resource('http://127.0.0.1:8080/api/v1/namespaces/default/pods/:name'),
     Replicationcontrollers: $resource('http://127.0.0.1:8080/api/v1/namespaces/default/replicationcontrollers/:name'),
     Namespaces: $resource('http://127.0.0.1:8080/api/v1/namespaces/:name'),
     Nodes: $resource('http://127.0.0.1:8080/api/v1/nodes/:name'),
     Secrets: $resource('http://127.0.0.1:8080/api/v1/namespaces/default/secrets/:name'),
     Resourcequotas: $resource('http://127.0.0.1:8080/api/v1/namespaces/default/resourcequotas/:name'),
   };
});

kuiApp.factory('socket', function($rootScope) {
  io = require('socket.io');
  var socket = io('http://127.0.0.1:8080/api/v1/watch/namespaces/default/pods');
  return {
        on: function(eventName, fn) {
            socket.on(eventName, function(data) {
                $rootScope.$apply(function() {
                    fn(data);
                });
            });
        },
  };
});

kuiApp.controller("podController", function ( $scope, k8s) {

  //$scope.socket.on('connection', function(){
  //  console.log('received socket info');
  //});

  var items = k8s.Pods.get(function(){
    $scope.pods = items.items;
    console.log('pods:',$scope.pods);
  });

  $scope.start = function ( pod ) {
        alert("Start invoked for:".concat(pod));
    }

  $scope.stop = function ( pod ) {
        alert("Stop invoked.".concat(pod));
    }

  $scope.delete = function ( pod ) {
        k8s.Pods.delete({name: pod});
        alert("Delete invoked.".concat(pod));
    }

});

kuiApp.controller("servicesController", function ( $scope, k8s ) {

  var items = k8s.Services.get(function(){
      $scope.services = items.items;
      console.log('services:',$scope.services);
    });

  $scope.start = function ( service ) {
        alert("Start invoked for:".concat(service));
    }

  $scope.stop = function ( service ) {
        alert("Stop invoked.".concat(service));
    }

  $scope.delete = function ( service ) {
        k8s.Services.delete({name: service});
        alert("Delete invoked.".concat(service));
    }

});

kuiApp.controller("rcController", function ( $scope, k8s) {

  var items = k8s.Replicationcontrollers.get(function(){
      $scope.rc = items.items;
      console.log('rc:',$scope.rc);
    });

  $scope.start = function ( rc ) {
        alert("Start invoked for:".concat(rc));
    }

  $scope.stop = function ( rc) {
        alert("Stop invoked.".concat(rc));
    }

  $scope.delete = function ( rc ) {
        k8s.Replicationcontrollers.delete({name: rc});
        alert("Delete invoked.".concat(rc));
    }

});
