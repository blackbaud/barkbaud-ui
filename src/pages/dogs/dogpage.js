/*global angular */

(function () {
    'use strict';

    function DogPageController($stateParams, bbData, bbWindow, dogId) {
        var self = this;

        self.tiles = [
            {
                id: 'DogSummaryTile',
                view_name: 'summary',
                collapsed: false,
                collapsed_small: false
            },
            {
                id: 'DogNotesTile',
                view_name: 'notes',
                collapsed: false,
                collapsed_small: false
            }
        ];

        self.layout = {
            one_column_layout: [
                'DogSummaryTile',
                'DogNotesTile'
            ],
            two_column_layout: [
                [
                    'DogSummaryTile'
                ],
                [
                    'DogNotesTile'
                ]
            ]
        };

        bbData.load({
            data: 'api/dogs/' + encodeURIComponent(dogId)
        }).then(function (result) {
            self.dog = result.data.data;
            bbWindow.setWindowTitle(self.dog.name);
        });
    }

    DogPageController.$inject = ['$stateParams', 'bbData', 'bbWindow', 'dogId'];

    angular.module('barkbaud')
        .controller('DogPageController', DogPageController);
}());
