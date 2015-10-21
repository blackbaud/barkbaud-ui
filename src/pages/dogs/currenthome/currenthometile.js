/*global angular */

(function () {
    'use strict';

    function DogCurrentHomeTileController($scope, bbData, bbMoment, barkFindHome, dogId) {
        var self = this;

        self.load = function () {
            $scope.$emit('bbBeginWait', { nonblocking: true });
            bbData.load({
                data: 'api/dogs/' + encodeURIComponent(dogId) + '/currenthome'
            }).then(function (result) {
                self.currentHome = result.data.data;
                $scope.$emit('bbEndWait', { nonblocking: true });
            }).catch(function () {
                self.error = true;
                $scope.$emit('bbEndWait', { nonblocking: true });
            });
        };

        self.getTimeInHome = function (fromDate) {
            var fromDateMoment = bbMoment(fromDate.iso);

            return 'since ' + fromDateMoment.format('L') + ' (' + fromDateMoment.startOf('month').fromNow(true) + ')';
        };

        self.findHome = function () {
            barkFindHome.open(dogId).result.then(self.load);
        }

        self.load();
    }

    DogCurrentHomeTileController.$inject = [
        '$scope',
        'bbData',
        'bbMoment',
        'barkFindHome',
        'dogId'
    ];

    angular.module('barkbaud')
        .controller('DogCurrentHomeTileController', DogCurrentHomeTileController);
}());
