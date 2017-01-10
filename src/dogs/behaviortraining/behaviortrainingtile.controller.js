/*global angular */

(function () {
    'use strict';

    function DogBehaviorTrainingTileController($scope, bbData, bbMoment, dogId, behaviorTrainingAdd) {
        var self = this;
        console.log(dogId);

        self.load = function () {
            $scope.$emit('bbBeginWait', { nonblocking: true });
            bbData.load({
                data: 'api/dogs/' + encodeURIComponent(dogId) + '/ratings'
            }).then(function (result) {
                self.ratings = result.data.value;
                $scope.$emit('bbEndWait', { nonblocking: true });
            }).catch(function (result) {
                self.error = result.data.error;
                $scope.$emit('bbEndWait', { nonblocking: true });
            });
        };

        self.addBehaviorTraining = function () {
            barkBehaviorTrainingAdd.open(dogId).result.then(self.load);
        };

        self.load();
    }

    DogBehaviorTrainingTileController.$inject = [
        '$scope',
        'bbData',
        'bbMoment',
        'bbModal',
        'dogId',
        'behaviorTrainingAdd'
    ];

    angular.module('barkbaud')
        .controller('DogBehaviorTrainingTileController', DogBehaviorTrainingTileController);
}());
