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

kuiApp.controller("servicesController", function ($rootScope, $scope, k8s, $filter, contextService, NgTableParams) {
    var self = this;

//    $scope.$watch($rootScope.client, function () {
//        alert('root changed');
//        refreshServices();
//    }, true);
//

    function refreshServices() {
        contextService.getConnection().services.get(function (err, slist) {
            if (!err && slist.length > 0) {
                var pd = slist[0];
                $scope.services = []
                for (var i = 0; i < pd.items.length; i++) {
                    $scope.services.push({service: pd.items[i], id: "service_" + i})
                }

                console.log('services:', $scope.services);
                self.tableParams = new NgTableParams({ count: 5}, { counts: [5, 10, 25], data: $scope.services});
            }
            else {
                console.log("Error fetching services" + err);
            }
            $scope.servicesReady = true;

        });

    }

    $scope.setLabelStr = function (l) {
        $scope.labelStr = JSON.stringify(l);
    }

    $scope.updateLabel = function (l, p) {

        contextService.getConnection().services.get(p, function (err, p1) {
            if (!err) {
                var oldlabel = p1.metadata.labels;
                p1.metadata.labels = JSON.parse(l);
                var newlabel = p1.metadata.labels;
                contextService.getConnection().services.update(p, p1, function (err, pnew) {
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

        var newservice = JSON.parse(npStr);

        contextService.getConnection().services.create(newservice, function (err, p1) {
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

        contextService.getConnection().services.get(p, function (err, p1) {
            if (!err) {
                var newservice = JSON.parse(pStr);
                contextService.getConnection().services.update(p, newservice, function (err, pnew) {
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

    var ws = contextService.getWebSocket('services')

    ws.onopen = function () {
        console.log("Socket has been opened!");
    };

    ws.onmessage = function (message) {
        listener(JSON.parse(message.data));
    };

    function listener(data) {
        var messageObj = data;
        if (data && (['ADDED', 'DELETED'].indexOf(data.type) != -1)) {
            console.log("Received data from websocket: ", messageObj);
            refreshServices();
        }
    }

    refreshServices();


    $scope.cancelCreateBtn = function () {
        $scope.newService = false;
    }
    $scope.cancelBtn = function (id, service) {
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

    $scope.start = function (service) {
        alert("Start invoked for:".concat(service));
    }

    $scope.stop = function (service) {
        alert("Stop invoked.".concat(service));
    }

    $scope.delete = function (s) {
        contextService.getConnection().services.delete(s, function (err) {
            if (err) {
                console.log('Delete failed:' + err);
    }
            else {
                console.log('Delete successful.');
    }
        });
    }
});