/*global angular */

(function () {
    'use strict';

    function barkBehaviorTrainingEdit(bbModal) {
        return {
            open: function (dogId, behaviortraining) {
                return bbModal.open({
                    controller: 'BehaviorTrainingEditController as behaviorTrainingEdit',
                    templateUrl: 'dogs/behaviortraining/behaviortrainingedit.html',
                    resolve: {
                        dogId: function () {
                            return dogId;
                        },
                        behaviortraining: function () {
                            return behaviortraining;
                        }
                    }
                });
            }
        };
    }

    barkBehaviorTrainingEdit.$inject = ['bbModal'];

    angular.module('barkbaud')
        .factory('barkBehaviorTrainingEdit', barkBehaviorTrainingEdit);
}());
