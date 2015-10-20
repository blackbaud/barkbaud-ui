/*global angular */

(function () {
    'use strict';

    function DogNotesTileController($timeout, bbData, bbMoment, barkNoteAdd, dogId) {
        var self = this;

        bbData.load({
            data: 'api/dogs/' + encodeURIComponent(dogId) + '/notes'
        }).then(function (result) {
            self.notes = result.data.data;
        });

        self.getNoteDate = function (date) {
            if (date && date.iso) {
                return bbMoment(date.iso).calendar();
            }
        };

        self.addNote = function () {
            barkNoteAdd.open(dogId);
        };
    }

    DogNotesTileController.$inject = ['$timeout', 'bbData', 'bbMoment', 'barkNoteAdd', 'dogId'];

    angular.module('barkbaud')
        .controller('DogNotesTileController', DogNotesTileController);
}());
