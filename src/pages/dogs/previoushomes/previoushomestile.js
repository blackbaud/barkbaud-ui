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
                self.previousHomes = result.data.data;
                $scope.$emit('bbEndWait', { nonblocking: true });
            }).catch(function () {
                self.error = true;
                $scope.$emit('bbEndWait', { nonblocking: true });
            });
        };

        self.getSummaryDate = function (date) {
            if (date && date.iso) {
                return bbMoment(date.iso).format('MMM Do YY');
            }
        };

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
