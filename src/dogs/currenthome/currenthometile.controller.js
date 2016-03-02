/*global angular */

(function () {
    'use strict';

    function DogCurrentHomeTileController($rootScope, $scope, bbData, bbMoment, barkFindHome, dogId) {
        var self = this;

        self.load = function () {
            $scope.$emit('bbBeginWait', { nonblocking: true });
            bbData.load({
                data: 'api/dogs/' + encodeURIComponent(dogId) + '/currenthome'
            }).then(function (result) {
                self.currentHome = result.data.data;
                $scope.$emit('bbEndWait', { nonblocking: true });
            }).catch(function (result) {
                self.error = result.data.error;
                $scope.$emit('bbEndWait', { nonblocking: true });
            });
        };

        self.getTimeInHome = function (fromDate) {
            var fromDateMoment = bbMoment(fromDate);

            return 'since ' + fromDateMoment.format('L') + ' (' + fromDateMoment.startOf('month').fromNow(true) + ')';
        };

        self.findHome = function () {
            barkFindHome.open(dogId).result.then(function () {
                self.load();
                $rootScope.$broadcast('bbNewCurrentOwner');
            });
        };

        self.load();
    }

    DogCurrentHomeTileController.$inject = [
        '$rootScope',
        '$scope',
        'bbData',
        'bbMoment',
        'barkFindHome',
        'dogId'
    ];

    angular.module('barkbaud')
        .controller('DogCurrentHomeTileController', DogCurrentHomeTileController);
}());
