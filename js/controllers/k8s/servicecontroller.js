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


kuiApp.controller("servicesController", function ($scope, k8s, $filter, contextService) {

    function refreshServices() {
        $scope.servicesReady = false;
        var items = k8s.Services.get(function (pd) {
            $scope.services = []
            for (var i = 0; i < pd.items.length; i++) {
                $scope.services.push({service: pd.items[i], id: "service_" + i})
            }
            console.log('services:', $scope.services);
        });
        $scope.servicesReady = true;

    }

    $scope.setLabelStr = function (l) {
        $scope.labelStr = JSON.stringify(l);
    }

    $scope.updateLabel = function (l, p) {

        var Client = require('node-kubernetes-client');
        client = new Client({
            "protocol": contextService.getProtocol(),
            "host": contextService.getHost(),
            "version": "v1",
            "namespace": "default"
        });

        client.services.get(p, function (err, p1) {
            if (!err) {
                var oldlabel = p1.metadata.labels;
                p1.metadata.labels = JSON.parse(l);
                var newlabel = p1.metadata.labels;
                client.services.update(p, p1, function (err, pnew) {
                    if (!err) {
                        console.log('Service: ' + JSON.stringify(pnew));
                    } else {
                        console.log('Service: ' + JSON.stringify(err));
                        alert(JSON.stringify(err.message.message));
                    }
                });
            } else {
                console.log(err);
                alert("Failed to get the resource.");
            }
        });

        $scope.labelStr = null;
    }

    $scope.$watch('jsonData', function (json) {
        $scope.pStr = $filter('json')(json);
    }, true);

    $scope.$watch('pStr', function (json) {
        try {
            $scope.jsonData = JSON.parse(json);
            $scope.wellFormed = true;
        } catch (e) {
            $scope.wellFormed = false;
        }
    }, true);

    $scope.createService = function (npStr) {
        var Client = require('node-kubernetes-client');
        client = new Client({
            "protocol": contextService.getProtocol(),
            "host": contextService.getHost(),
            "version": "v1",
            "namespace": "default"
        });

        var newservice = JSON.parse(npStr);

        client.services.create(newservice, function (err, p1) {
            if (!err) {
                console.log('service: ' + JSON.stringify(p1));
            } else {
                console.log('service: ' + JSON.stringify(err));
                alert(JSON.stringify(err.message.message));
            }
            $scope.newService = false;
        });
    }


    $scope.updateService = function (id, pStr, p) {

        var Client = require('node-kubernetes-client');
        client = new Client({
            "protocol": contextService.getProtocol(),
            "host": contextService.getHost(),
            "version": "v1",
            "namespace": "default"
        });

        client.services.get(p, function (err, p1) {
            if (!err) {
                var newservice = JSON.parse(pStr);
                client.services.update(p, newservice, function (err, pnew) {
                    if (!err) {
                        console.log('service: ' + JSON.stringify(pnew));
                    } else {
                        console.log('service: ' + JSON.stringify(err));
                        alert(JSON.stringify(err.message.message));
                    }
                });
            } else {
                console.log(err);
                alert("Failed to get the resource.");
            }
        });

        $scope["service_" + id] = true;


        $scope.labelStr = null;
    }


    $scope.editService = function (id, service) {
        for (var i = 0; i < $scope.services.length; i++) {
            if (("service_" + i) == id && service) {
                $scope[id] = true;
                $scope.pStr = $filter('json')(service);
            }
            else {
                $scope["service_" + i] = false;
            }
        }
    }

    var ws = new WebSocket("ws://" + contextService.getHost() + "/api/v1/namespaces/default/services?watch=true");

    ws.onopen = function () {
        console.log("Socket has been opened!");
    };

    ws.onmessage = function (message) {
        listener(JSON.parse(message.data));
    };

    function listener(data) {
        var messageObj = data;
        console.log("Received data from websocket: ", messageObj);
        refreshServices();

    }

    refreshServices();

    $scope.start = function (service) {
        alert("Start invoked for:".concat(service));
    }

    $scope.stop = function (service) {
        alert("Stop invoked.".concat(service));
    }

    $scope.delete = function (service) {
        k8s.Services.delete({name: service});
        alert("Delete invoked.".concat(service));
    }

    $scope.onChange = function (value) {
        alert(value);
    }

});