/*global angular */

(function () {
    'use strict';

    function DogPreviousHomesTileController($timeout, bbData, dogId) {
        var self = this;

        bbData.load({
            data: 'api/dogs/' + encodeURIComponent(dogId) + '/previoushomes'
        }).then(function (result) {
            self.previousHomes = result.data;
        });
    }

    DogPreviousHomesTileController.$inject = ['$timeout', 'bbData', 'dogId'];

    angular.module('barkbaud')
        .controller('DogPreviousHomesTileController', DogPreviousHomesTileController);
}());
