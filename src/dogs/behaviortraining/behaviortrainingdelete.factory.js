/*global angular */

(function () {
    'use strict';

    function barkBehaviorTrainingDelete(bbModal) {
        return {
            open: function (dogId, behaviorTrainingId) {
                return bbModal.open({
                    controller: 'BehaviorTrainingDeleteController as behaviorTrainingDelete',
                    templateUrl: 'dogs/behaviortraining/behaviortrainingdelete.html',
                    resolve: {
                        dogId: function () {
                            return dogId;
                        },
                        behaviorTrainingId: function() {
                            return behaviorTrainingId;
                        }
                    }
                });
            }
        };
    }

    barkBehaviorTrainingDelete.$inject = ['bbModal'];

    angular.module('barkbaud')
        .factory('barkBehaviorTrainingDelete', barkBehaviorTrainingDelete);
}());
