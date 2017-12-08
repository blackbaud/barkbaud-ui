/*global angular */

(function () {
    'use strict';

    function DogBehaviorTrainingTileController($scope, bbData, bbMoment, bbModal, dogId, barkBehaviorTrainingAdd, barkBehaviorTrainingEdit, barkBehaviorTrainingDelete) {
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

        self.addBehaviorTraining = function () {
            barkBehaviorTrainingAdd.open(dogId).result.then(self.load, angular.noop);
        };

        self.editBehaviorTraining = function (behaviortraining) {
            barkBehaviorTrainingEdit.open(dogId, behaviortraining).result.then(self.load, angular.noop);
        };

        self.deleteBehaviorTraining = function (behaviorTrainingId) {
            barkBehaviorTrainingDelete.open(dogId, behaviorTrainingId).result.then(self.load, angular.noop);
        };

        self.load();
    };

    DogBehaviorTrainingTileController.$inject = [
        '$scope',
        'bbData',
        'bbMoment',
        'bbModal',
        'dogId',
        'barkBehaviorTrainingAdd',
        'barkBehaviorTrainingEdit',
        'barkBehaviorTrainingDelete'
    ];

    angular.module('barkbaud')
        .controller('DogBehaviorTrainingTileController', DogBehaviorTrainingTileController);
}());
