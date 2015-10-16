/*global angular */

(function () {
    'use strict';

    function DogNotesTileController($timeout, bbData, dogId) {
        var self = this;

        bbData.load({
            data: 'api/dogs/' + encodeURIComponent(dogId) + '/notes'
        }).then(function (result) {
            self.notes = result.data.data;
        });
    }

    DogNotesTileController.$inject = ['$timeout', 'bbData', 'dogId'];

    angular.module('barkbaud')
        .controller('DogNotesTileController', DogNotesTileController);
}());
