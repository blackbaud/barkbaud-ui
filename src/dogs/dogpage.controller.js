/*global angular */

(function () {
    'use strict';

    function dogPageConfig($stateProvider) {
        $stateProvider
            .state('dog', {
                abstract: true,
                controller: 'DogPageController as dogPage',
                templateUrl: 'dogs/dogpage.html',
                url: '/dogs/:dogId',
                resolve: {
                    dogId: ['$stateParams', function ($stateParams) {
                        return $stateParams.dogId;
                    }]
                }
            })
            .state('dog.views', {
                url: '',
                views: {
                    'currenthome': {
                        controller: 'DogCurrentHomeTileController as dogCurrentHomeTile',
                        templateUrl: 'dogs/currenthome/currenthometile.html'
                    },
                    'previoushomes': {
                        controller: 'DogPreviousHomesTileController as dogPreviousHomesTile',
                        templateUrl: 'dogs/previoushomes/previoushomestile.html'
                    },
                    'notes': {
                        controller: 'DogNotesTileController as dogNotesTile',
                        templateUrl: 'dogs/notes/notestile.html'
                    }
                }
            });
    }

    dogPageConfig.$inject = ['$stateProvider'];

    function DogPageController($scope, $stateParams, bbData, bbWindow, dogId) {
        var self = this;

        self.tiles = [
            {
                id: 'DogCurrentHomeTile',
                view_name: 'currenthome',
                collapsed: false,
                collapsed_small: false
            },
            {
                id: 'DogPreviousHomesTile',
                view_name: 'previoushomes',
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
                'DogCurrentHomeTile',
                'DogPreviousHomesTile',
                'DogNotesTile'
            ],
            two_column_layout: [
                [
                    'DogCurrentHomeTile',
                    'DogPreviousHomesTile'
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

    DogPageController.$inject = [
        '$scope',
        '$stateParams',
        'bbData',
        'bbWindow',
        'dogId'
    ];

    angular.module('barkbaud')
        .config(dogPageConfig)
        .controller('DogPageController', DogPageController);
}());
