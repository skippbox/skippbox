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

kuiApp.controller("machineController", function($rootScope, $scope, k8s, $filter, contextService, NgTableParams) {
    var self = this;
    $scope.machines = [];
    $scope.hideForm = true;
    $scope.currentMachine = "";

    //var shell = require('shelljs');
    var shell = require('child_process');

    $scope.createProxy = function() {
        var child = shell.exec('kubectl proxy --port=8080', { silent: true, async: true });
        child.stderr.on('data', function(data) {
            console.log('stderr :', data);
        });
        child.on('error', function(err) {
            console.log('Error: ' + err);
        });
    }

    $scope.deleteProxy = function() {
        var child = shell.exec('pgrep kubectl | xargs kill -9', { silent: true, async: true });
        child.stderr.on('data', function(data) {
            console.log('stderr :', data);
        });
        child.on('error', function(err) {
            
        });
    }

    $scope.createMachine = function(driver, name) {
        console.log(driver);
        var cmd = 'kmachine create -d ' + driver + ' ' + name
        var child = shell.exec(cmd, { silent: true, async: true });
        console.log(cmd);

        child.stdout.on('data', function(data) {
            console.log('Stdout: ', data);
        });
        child.stderr.on('data', function(data) {
            console.log('stderr :', data);
        });

        child.on('close', function(code) {
            console.log('closing code: ' + code);
            $scope.$apply();
        });
        child.on('error', function(err) {
            console.log('Error: ' + err);
        });

        $scope.newMachineNameDO = "";
        $scope.newMachineNameAWS = "";
        $scope.newMachineNameExoscale = "";
        $scope.newMachineNameVB = "";
        $scope.$apply();

    }

    $scope.deleteMachine = function(m) {
        $scope.deleteProxy();
        console.log(m);
        var cmd = 'kmachine rm '.concat(m[0]);
        console.log('command: ', cmd);
        var child = shell.exec(cmd, { silent: true, async: true });
        child.stdout.on('data', function(data) {
            console.log('context: ', data);
        });
        child.on('close', function(code) {
            $scope.listMachines();
        });
        child.on('error', function(err) {
            console.log('Error: ' + err);
        });
    }

    $scope.startMachine = function(m) {
        $scope.deleteProxy();
        console.log(m);
        var cmd = 'kmachine start '.concat(m[0]);
        console.log('command: ', cmd);
        var child = shell.exec(cmd, { silent: true, async: true });
        child.stdout.on('data', function(data) {
            console.log('context: ', data);
        });
        child.on('close', function(code) {
            $scope.listMachines();
        });
        child.on('error', function(err) {
            console.log('Error: ' + err);
        });
    }

    $scope.stopMachine = function(m) {
        $scope.deleteProxy();
        console.log(m);
        var cmd = 'kmachine stop '.concat(m[0]);
        console.log('command: ', cmd);
        var child = shell.exec(cmd, { silent: true, async: true });
        child.stdout.on('data', function(data) {
            console.log('context: ', data);
        });
        child.on('close', function(code) {
            $scope.listMachines();
        });
        child.on('error', function(err) {
            console.log('Error: ' + err);
        });
    }

    $scope.launchDashboard = function() {
        var gui = require('nw.gui')
        var new_win = gui.Window.open('http://localhost:8080/api/v1/proxy/namespaces/kube-system/services/kubernetes-dashboard/');
    }

    $scope.listMachines = function() {
        $scope.machines = [];
        var child = shell.exec("kmachine ls | tail -n +2", { silent: true, async: true });
        child.stdout.on('data', function(data) {
            console.log('Stdout: ', JSON.stringify(data.split("\n")));
            var result = data.split("\n");
            result.pop();
            angular.forEach(result, function (elem, key) {
                var machine = elem.split(/\s+/g);
                console.log(JSON.stringify(machine));
                machine[4]=false;
                $scope.machines.push(machine);
            });
            $scope.$apply();
        });
        child.on('error', function(err) {
            console.log('Error: ' + err);
        });
    }

    $scope.listMachines();

    $scope.useMachine = function(m) {
        $scope.deleteProxy();
        $scope.currentMachine = m;
        console.log(m);
        var cmd = 'kubectl config use-context '.concat(m[0]);
        console.log('command: ', cmd);
        var child = shell.exec(cmd, { silent: true, async: true });
        child.stdout.on('data', function(data) {
            console.log('context: ', data);
        });
        child.on('close', function(code) {
            m[4]=true;
            $scope.createProxy();
            $scope.$apply();
        });
        child.on('error', function(err) {
            console.log('Error: ' + err);
        });
    }

});
