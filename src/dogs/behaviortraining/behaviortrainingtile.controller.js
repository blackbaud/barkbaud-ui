/*global angular */

(function () {
    'use strict';

    function DogBehaviorTrainingTileController($scope, bbData, bbMoment, barkBehaviorTrainingAdd, dogId) {
        var self = this;

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

        self.addNote = function () {
            barkBehaviorTrainingAdd.open(dogId).result.then(self.load);
        };

        self.load();
    }

    DogBehaviorTrainingTileController.$inject = [
        '$scope',
        'bbData',
        'bbMoment',
        'barkBehaviorTrainingAdd',
        'dogId'
    ];

    angular.module('barkbaud')
        .controller('DogBehaviorTrainingTileController', DogBehaviorTrainingTileController);
}());
