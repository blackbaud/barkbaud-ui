/*global angular */

(function () {
    'use strict';

    function NoteAddController($modalInstance, bbData, dogId) {
        var self = this;

        self.note = {};
        self.saveData = function () {
            bbData.save({
                url: 'api/dogs/' + dogId + '/notes',
                data: self.note,
                type: 'POST'
            }).then(function (result) {
                $modalInstance.close(result.data);
            }).catch(function (result) {
                self.error = result.data.error;
            });
        };
    }

    NoteAddController.$inject = [
        '$modalInstance',
        'bbData',
        'dogId'
    ];

    angular.module('barkbaud')
        .controller('NoteAddController', NoteAddController);
}());
