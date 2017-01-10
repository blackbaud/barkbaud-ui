/*global angular */

(function () {
    'use strict';

    function behaviorTrainingAdd(bbModal) {
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

    barkNoteAdd.$inject = ['bbModal'];

    angular.module('barkbaud')
        .factory('behaviorTrainingAdd', behaviorTrainingAdd);
}());
