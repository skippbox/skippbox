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

kuiApp.controller("podController", function ($scope, k8s) {
    function refreshPods() {
        $scope.podsReady = false;
        var items = k8s.Pods.get(function (pd) {
            $scope.pods = []
            for (var i = 0; i < pd.items.length; i++) {
                $scope.pods.push({pod: pd.items[i], id: "pod_" + i})
            }
            console.log('pods:', $scope.pods);
        });
        $scope.podsReady = true;

    }

    $scope.setLabelStr = function(l) {
        $scope.labelStr = JSON.stringify(l);
    }

    $scope.updateLabel = function(l, p) {

        var Client = require('node-kubernetes-client');
        client = new Client({
            "protocol": "http",
            "host": "localhost:8080",
            "version": "v1",
            "namespace": "default"
        });

        client.pods.get(p, function (err, p1) {
            if (!err) {
                var oldlabel = p1.metadata.labels;
                p1.metadata.labels = JSON.parse(l);
                var newlabel = p1.metadata.labels;
                client.pods.update(p, p1, function (err, pnew) {
                    if (!err) {
                        console.log('pod: ' + JSON.stringify(pnew));
                    } else {
                        console.log('pod: ' + JSON.stringify(err));
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

    $scope.editPod = function (id, pod) {
        if (id && pod) {
            $scope["pod_" + id] = true;
            $scope.pStr = JSON.stringify(pod);
        }
    }

    var ws = new WebSocket("ws://127.0.0.1:8080/api/v1/namespaces/default/pods?watch=true");

    ws.onopen = function () {
        console.log("Socket has been opened!");
    };

    ws.onmessage = function (message) {
        listener(JSON.parse(message.data));
    };

    function listener(data) {
        var messageObj = data;
        if (data) {
            console.log("Received data from websocket: ", messageObj);
            refreshPods();
        }
    }

//
//    socket.on('connection', function(args){
//      console.log('received socket info' +args);
//    });

    refreshPods();

    $scope.start = function (pod) {
        alert("Start invoked for:".concat(pod));
    }

    $scope.stop = function (pod) {
        alert("Stop invoked.".concat(pod));
    }

    $scope.delete = function (pod) {
        k8s.Pods.delete({name: pod});
        alert("Delete invoked.".concat(pod));
    }

});