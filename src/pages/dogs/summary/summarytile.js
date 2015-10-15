/*global angular */

(function () {
    'use strict';

    function DogSummaryTileController($timeout, bbData, dogId) {
        var self = this;

        bbData.load({
            data: 'api/dogs/' + encodeURIComponent(dogId) + '/summary'
        }).then(function (result) {
            self.summary = result.data;
        });
    }

    DogSummaryTileController.$inject = ['$timeout', 'bbData', 'dogId'];

    angular.module('barkbaud')
        .controller('DogSummaryTileController', DogSummaryTileController);
}());
