/*global angular */

(function () {
    'use strict';

    function NoteAddController() {
    }

    function barkNoteAdd(bbModal) {
        return {
            open: function () {
                return bbModal.open({
                    controller: 'NoteAddController as noteAdd',
                    templateUrl: 'pages/dogs/notes/noteadd.html'
                });
            }
        };
    }

    barkNoteAdd.$inject = ['bbModal'];

    angular.module('barkbaud')
        .controller('NoteAddController', NoteAddController)
        .factory('barkNoteAdd', barkNoteAdd);
}());
