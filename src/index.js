/*globals angular */

(function () {
    'use strict';

    var barkbaudConfig = {
        apiUrl: 'https://glacial-mountain-6366.herokuapp.com/'
    };

    function config($locationProvider, $stateProvider, bbWindowConfig) {
        $locationProvider.html5Mode(false);

        $stateProvider
            .state('home', {
                controller: 'DashboardPageController as dashboardPage',
                templateUrl: 'pages/dashboard/dashboardpage.html',
                url: ''
            })
            .state('dog', {
                abstract: true,
                controller: 'DogPageController as dogPage',
                templateUrl: 'pages/dogs/dogpage.html',
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
                    'summary': {
                        controller: 'DogSummaryTileController as dogSummaryTile',
                        templateUrl: 'pages/dogs/summary/summarytile.html'
                    },
                    'notes': {
                        controller: 'DogNotesTileController as dogNotesTile',
                        templateUrl: 'pages/dogs/notes/notestile.html'
                    }
                }
            });

        bbWindowConfig.productName = 'Barkbaud';
    }

    config.$inject = ['$locationProvider', '$stateProvider', 'bbWindowConfig'];

    function run(bbDataConfig) {
        function addBaseUrl(url) {
            return barkbaudConfig.apiUrl + url;
        }

        bbDataConfig.dataUrlFilter = addBaseUrl;
        bbDataConfig.resourceUrlFilter = addBaseUrl;
    }

    run.$inject = ['bbDataConfig'];

    angular.module('barkbaud', ['sky', 'ui.bootstrap', 'ui.router', 'ngAnimate', 'barkbaud.templates'])
        .constant('barkbaudConfig', barkbaudConfig)
        .config(config)
        .run(run)
        .controller('MainController', angular.noop);
}());
