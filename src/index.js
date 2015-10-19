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
