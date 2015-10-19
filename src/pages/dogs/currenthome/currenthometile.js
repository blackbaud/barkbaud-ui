/*global angular */

(function () {
    'use strict';

    function DogCurrentHomeTileController($timeout, bbData, dogId) {
        var self = this;

        bbData.load({
            data: 'api/dogs/' + encodeURIComponent(dogId) + '/currenthome'
        }).then(function (result) {
            self.currentHome = result.data;
        });
    }

    DogCurrentHomeTileController.$inject = ['$timeout', 'bbData', 'dogId'];

    angular.module('barkbaud')
        .controller('DogCurrentHomeTileController', DogCurrentHomeTileController);
}());
