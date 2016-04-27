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


angular.module('LabelFormat', [])
    .directive('labelformat', function () {
        return {
            restrict: 'E',
            scope: {
                labelJson: '=?json',
                message: '=?labeltext',
                updateLabelFn: '=fn',
                key: '=name',
                rw: '=?rw'

            },
            templateUrl: 'views/partial/labelformat.html',
            link: function (scope, elem, attrs) {
                scope.addLabelDiv = false;
                scope.showThis = true;


                if (scope.message) {
                    scope.labelJson = JSON.parse(scope.message);
                }

                if (!scope.labelJson) {
                    scope.labelJson = {}
                }

                scope.removeLabel = function (k) {
                    delete scope.labelJson[k];
                    scope.updateLabelFn(JSON.stringify(scope.labelJson), scope.key);
                }

                scope.showLabelAdd = function () {
                    scope.addLabelDiv = !scope.addLabelDiv;
                }

                scope.addLabel = function (newLabel) {
                    var k = newLabel.substring(0, newLabel.indexOf(':'));
                    var v = newLabel.substring(newLabel.indexOf(':') + 1);
                    scope.labelJson[k] = v;
                    scope.updateLabelFn(JSON.stringify(scope.labelJson), scope.key);
                }
            }
        }
    });
