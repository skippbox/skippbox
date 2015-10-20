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

kuiApp.controller("rcController", function ($scope, k8s, $filter, contextService, NgTableParams) {
    var self = this;

    //    $scope.$watch($rootScope.client, function () {
//        alert('root changed');
//        refreshServices();
//    }, true);
//

    function refreshRcs() {
        contextService.getConnection().replicationControllers.get(function (err, rlist) {
            if (!err && rlist.length > 0) {
                var pd = rlist[0];
                $scope.rc = []
                for (var i = 0; i < pd.items.length; i++) {
                    $scope.rc.push({rc: pd.items[i], id: "rc_" + i})
                }
                console.log('rc:', $scope.rc);
                self.tableParams = new NgTableParams({ count: 5}, { counts: [5, 10, 25], data: $scope.rc});
            }
            else {
                console.log("Error fetching rc" + err);
            }
            $scope.loaded = true;
        });

    }

    $scope.setLabelStr = function (l) {
        $scope.labelStr = JSON.stringify(l);
    }

    $scope.updateLabel = function (l, p) {

        contextService.getConnection().replicationControllers.get(p, function (err, p1) {
            if (!err) {
                var oldlabel = p1.metadata.labels;
                p1.metadata.labels = JSON.parse(l);
                var newlabel = p1.metadata.labels;
                contextService.getConnection().replicationControllers.update(p, p1, function (err, pnew) {
                    if (!err) {
                        console.log('rc: ' + JSON.stringify(pnew));
                    } else {
                        console.log('rc: ' + JSON.stringify(err));
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

    $scope.createRc = function (npStr) {

        var newrc = JSON.parse(npStr);

        contextService.getConnection().replicationControllers.create(newrc, function (err, p1) {
            if (!err) {
                console.log('rc: ' + JSON.stringify(p1));
            } else {
                console.log('rc: ' + JSON.stringify(err));
                alert(JSON.stringify(err.message.message));
            }
            $scope.newRc = false;
        });
    }

    $scope.updateRc = function (id, pStr, p) {

        contextService.getConnection().replicationControllers.get(p, function (err, p1) {
            if (!err) {
                var newrc = JSON.parse(pStr);
                contextService.getConnection().replicationControllers.update(p, newrc, function (err, pnew) {
                    if (!err) {
                        console.log('rc: ' + JSON.stringify(pnew));
                    } else {
                        console.log('rc: ' + JSON.stringify(err));
                        alert(JSON.stringify(err.message.message));
                    }
                });
            } else {
                console.log(err);
                alert("Failed to get the resource.");
            }
        });

        $scope["rc_" + id] = true;

        $scope.labelStr = null;
    }

    $scope.editRc = function (id, rc) {
        for (var i = 0; i < $scope.rc.length; i++) {
            if (("rc_" + i) == id && rc) {
                $scope[id] = true;
                $scope.pStr = $filter('json')(rc);
            }
            else {
                $scope["rc_" + i] = false;
            }
        }
    }

    var ws = contextService.getWebSocket('replicationcontrollers');

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
            if ($scope.loaded)
                refreshRcs();
        }
    }

    refreshRcs();

    $scope.updateReplica = function (cnt, rc) {

        contextService.getConnection().replicationControllers.get(rc, function (err, rc1) {
            if (!err) {
                rc1.spec.replicas = cnt;
                contextService.getConnection().replicationControllers.update(rc, rc1, function (err, rcnew) {
                    if (!err) {
                        console.log('rc: ' + JSON.stringify(rcnew));
                    } else {
                        console.log('rc: ' + JSON.stringify(err));
                        alert("Failed to update replica count");
                    }
                });
            } else {
                console.log(err);
                alert("Failed to get the resource.");
            }
        });
    }

    $scope.cancelCreateBtn = function () {
        $scope.newRc = false;
    }

    $scope.cancelBtn = function (id, rc) {
        for (var i = 0; i < $scope.rc.length; i++) {
            if (("rc_" + i) == id && rc) {
                $scope[id] = true;
                $scope.pStr = $filter('json')(rc);
            }
            else {
                $scope["rc_" + i] = false;
            }
        }
    }

    $scope.start = function (rc) {
        alert("Start invoked for:".concat(rc));
    }

    $scope.stop = function (rc) {
        alert("Stop invoked.".concat(rc));
    }

    $scope.delete = function (s) {
        contextService.getConnection().replicationControllers.delete(s, function (err) {
            if (err) {
                console.log('Delete failed:' + err);
            }
            else {
                console.log('Delete successful.');
            }
        });
    }

});
