/*globals angular */

(function () {
    'use strict';

    var barkbaudConfig = {
        apiUrl: 'https://glacial-mountain-6366.herokuapp.com/'
    };

    function config($locationProvider, $urlRouterProvider, $stateProvider, bbWindowConfig) {
        $locationProvider.html5Mode(false);
        $urlRouterProvider.otherwise('/home');
        $stateProvider
            .state('login', {
                controller: 'LoginPageController as loginPage',
                templateUrl: 'pages/login/loginpage.html',
                url: '/login'
            })
            .state('home', {
                controller: 'DashboardPageController as dashboardPage',
                templateUrl: 'pages/dashboard/dashboardpage.html',
                url: '/home'
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

    config.$inject = ['$locationProvider', '$urlRouterProvider', '$stateProvider', 'bbWindowConfig'];

    function run(bbDataConfig, barkbaudAuthService, $rootScope, $state) {

        $rootScope.$on('$stateChangeStart', function (event, toState) {
            if (!barkbaudAuthService.authenticated && toState.name !== 'login') {
                event.preventDefault();
                $state.go('login');
            }
        });

        function addBaseUrl(url) {
            return barkbaudConfig.apiUrl + url;
        }

        bbDataConfig.dataUrlFilter = addBaseUrl;
        bbDataConfig.resourceUrlFilter = addBaseUrl;
    }

    run.$inject = ['bbDataConfig', 'barkbaudAuthService', '$rootScope', '$state'];

    angular.module('barkbaud', ['sky', 'ui.bootstrap', 'ui.router', 'ngAnimate', 'barkbaud.templates'])
        .constant('barkbaudConfig', barkbaudConfig)
        .config(config)
        .run(run)
        .controller('MainController', angular.noop);
}());
