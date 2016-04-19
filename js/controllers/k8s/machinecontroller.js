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

kuiApp.controller("machineController", function($rootScope, $scope, $location, $anchorScroll, k8s, $filter, contextService, NgTableParams) {
    var self = this;
    $scope.data = []
    $scope.hideForm = true;
    $scope.data.machines = [];
    $scope.data.showTerminal = false;

    //var shell = require('shelljs');
    var shell = require('child_process');

    $scope.createProxy = function() {
        var child = shell.exec('kubectl proxy --port=8080', { silent: true, async: true });
        child.stderr.on('data', function(data) {
            console.log('stderr :', data);
        });
        child.on('close', function(code) {
            console.log('closing code: ' + code);
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
        child.on('close', function(code) {
            console.log('closing code: ' + code);
        });
        child.on('error', function(err) {

        });
    }

    $scope.createMachine = function(driver, name) {
        $scope.data.outputs = [];
        var cmd = 'kmachine create -d ' + driver + ' ' + name
        var child = shell.exec(cmd, { silent: true, async: true });
        $scope.data.showTerminal = true;
        console.log(cmd);
        $scope.data.machines.push([name, '-', driver, 'Starting']);

        child.stdout.on('data', function(data) {
            console.log('Stdout: ', data);
            $scope.data.outputs.push(data);
            $scope.$apply();
            var objDiv = document.getElementById("bottom");
            objDiv.scrollTop = objDiv.scrollHeight;
        });
        child.stderr.on('data', function(data) {
            console.log('stderr :', data);
            $scope.data.outputs.push(data);
            $scope.$apply();
        });

        child.on('close', function(code) {
            console.log('closing code: ' + code);
            $scope.listMachines();
            $scope.data.showTerminal = false;
        });
        child.on('error', function(err) {
            console.log('Error: ' + err);
        });

        $scope.newMachineNameDO = "";
        $scope.newMachineNameAWS = "";
        $scope.newMachineNameExoscale = "";
        $scope.newMachineNameVB = "";

    }

    $scope.deleteMachine = function(m) {
        $scope.deleteProxy();
        var cmd = 'kmachine rm '.concat(m[0]);
        console.log('command: ', cmd);
        var child = shell.exec(cmd, { silent: true, async: true });
        m[4] = 'Waiting';
        child.stdout.on('data', function(data) {
            console.log('context: ', data);
        });
        child.on('close', function(code) {
            $scope.listMachines();
            console.log('closing code: ' + code);
        });
        child.on('error', function(err) {
            console.log('Error: ' + err);
        });
    }

    $scope.startMachine = function(m) {
        $scope.deleteProxy();
        var cmd = 'kmachine start '.concat(m[0]);
        console.log('command: ', cmd);
        var child = shell.exec(cmd, { silent: true, async: true });
        m[4] = 'Waiting';
        child.stdout.on('data', function(data) {
            console.log('context: ', data);
        });
        child.on('close', function(code) {
            $scope.listMachines();
            console.log('closing code: ' + code);
        });
        child.on('error', function(err) {
            console.log('Error: ' + err);
        });
    }

    $scope.stopMachine = function(m) {
        $scope.deleteProxy();
        var cmd = 'kmachine stop '.concat(m[0]);
        console.log('command: ', cmd);
        var child = shell.exec(cmd, { silent: true, async: true });
        m[4] = 'Waiting';
        child.stdout.on('data', function(data) {
            console.log('context: ', data);
        });
        child.stderr.on('data', function(data) {
            console.log('stderr :', data);
        });
        child.on('close', function(code) {
            $scope.listMachines();
            console.log('closing code: ' + code);
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
        $scope.data.machines = [];
        var child = shell.exec("kmachine ls | tail -n +2", { silent: true, async: true });
        child.stdout.on('data', function(data) {
            console.log('Stdout: ', JSON.stringify(data));
            var result = data.split("\n");
            result.pop();
            angular.forEach(result, function(elem, key) {
                var machine = elem.split(/\s+/g);
                //console.log(JSON.stringify(machine));
                machine[4] = false;
                $scope.data.machines.push(machine);
            });
        });
        child.on('close', function(code) {
            console.log('closing code: ' + code);
            $scope.getCurrentContext();
        });
        child.on('error', function(err) {
            console.log('Error: ' + err);
        });
    }

    $scope.listMachines();

    $scope.getCurrentContext = function() {
        $scope.data.currentContext = '';
        var child = shell.exec("kubectl config current-context", { silent: true, async: true });
        child.stdout.on('data', function(data) {
            console.log('Stdout: ', JSON.stringify(data));
            $scope.data.currentContext = data.replace("\n", "");
            angular.forEach($scope.data.machines, function(elem, key) {
                if (elem[0]===$scope.data.currentContext) $scope.useMachine($scope.data.machines[key]);
            });
        });
        child.stderr.on('data', function(data) {
            console.log('stderr: ', JSON.stringify(data));
        });
        child.on('close', function(code) {
            console.log('closing code: ' + code);
            $scope.$apply();
        });
        child.on('error', function(err) {
            console.log('Error: ' + err);
        });
    }

    $scope.useMachine = function(m) {
        $scope.deleteProxy();
        angular.forEach($scope.data.machines, function(elem, key) {
            elem[4] = false;
        });
        var cmd = 'kubectl config use-context '.concat(m[0]);
        console.log('command: ', cmd);
        var child = shell.exec(cmd, { silent: true, async: true });
        m[4] = 'Waiting';
        child.stdout.on('data', function(data) {
            console.log('context: ', data);
        });
        child.on('close', function(code) {
            m[4] = m[3];
            $scope.createProxy();
            console.log('closing code: ' + code);
            $scope.$apply();
        });
        child.on('error', function(err) {
            console.log('Error: ' + err);
        });
    }

});
