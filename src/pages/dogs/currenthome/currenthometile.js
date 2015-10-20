/*global angular */

(function () {
    'use strict';

    function DogCurrentHomeTileController($timeout, bbData, bbMoment, dogId) {
        var self = this;

        self.getTimeInHome = function (fromDate) {
            var fromDateMoment = bbMoment(fromDate.iso);

            return 'since ' + fromDateMoment.format('L') + ' (' + fromDateMoment.startOf('month').fromNow(true) + ')';
        };

        bbData.load({
            data: 'api/dogs/' + encodeURIComponent(dogId) + '/currenthome'
        }).then(function (result) {
            self.currentHome = result.data.data;
        });
    }

    DogCurrentHomeTileController.$inject = ['$timeout', 'bbData', 'bbMoment', 'dogId'];

    angular.module('barkbaud')
        .controller('DogCurrentHomeTileController', DogCurrentHomeTileController);
}());
