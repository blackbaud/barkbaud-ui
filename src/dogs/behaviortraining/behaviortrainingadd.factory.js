/*global angular */

(function () {
    'use strict';

    function barkBehaviorTrainingAdd(bbModal) {
        return {
            open: function (dogId) {
                return bbModal.open({
                    controller: 'BehaviorTrainingAddController as behaviorTrainingAdd',
                    templateUrl: 'dogs/behaviortraining/behaviortrainingadd.html',
                    resolve: {
                        dogId: function () {
                            return dogId;
                        }
                    }
                });
            }
        };
    }

    barkBehaviorTrainingAdd.$inject = ['bbModal'];

    angular.module('barkbaud')
        .factory('barkBehaviorTrainingAdd', barkBehaviorTrainingAdd);
}());
