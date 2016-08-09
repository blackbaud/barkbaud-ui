/*global angular */

(function () {
    'use strict';

    function DogPreviousHomesTileController($scope, bbData, bbMoment, dogId) {
        var self = this;

        self.load = function () {
            $scope.$emit('bbBeginWait', { nonblocking: true });
            bbData.load({
                data: 'api/dogs/' + encodeURIComponent(dogId) + '/previoushomes'
            }).then(function (result) {
                console.log("Previous homes success.", result);
                self.previousHomes = result.data.value;
                $scope.$emit('bbEndWait', { nonblocking: true });
            }).catch(function (result) {
                console.log("Previous homes error.", result);
                self.error = result.data.error;
                $scope.$emit('bbEndWait', { nonblocking: true });
            });
        };

        self.getSummaryDate = function (date) {
            if (date) {
                return bbMoment(date).format('MMM Do YY');
            }
        };

        $scope.$on('bbNewCurrentOwner', function () {
            self.load();
        });

        self.load();
    }

    DogPreviousHomesTileController.$inject = [
        '$scope',
        'bbData',
        'bbMoment',
        'dogId'
    ];

    angular.module('barkbaud')
        .controller('DogPreviousHomesTileController', DogPreviousHomesTileController);
}());
