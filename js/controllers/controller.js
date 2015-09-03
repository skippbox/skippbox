/**
 * Created by madang on 02/09/15.
 */


kuiApp.controller('kuiListController', function ($scope) {

    $scope.podLoaded = false;

    $scope.getPod = function () {
        var fs = require('fs');
        var Client = require('node-kubernetes-client');


        var client = new Client({
            host: '127.0.0.1:8080',
            protocol: 'http',
            version: 'v1',
            token: ''
        });

        var pods, podId;

        client.pods.getBy({"namespace": "default"}, function (err, podsArr) {
            if (!err) {
                $scope.pods = podsArr.items;
                $scope.podLoaded = true;
                window.document.getElementById('podvar').value = podsArr.items;
            } else {
                $scope.error = err;
            }
        });
    }

    $scope.showContainers = function() {
        $scope.bcontainers = !$scope.bcontainers;
    }

    $scope.start = function () {
        alert("Start invoked.");
    }
    $scope.stop = function () {
        alert("Stop invoked.");
    }
    $scope.delete = function () {
        alert("Delete invoked.");
    }
});